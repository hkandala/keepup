import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { Prisma } from "@prisma/client";
import Joi from "joi";

import { authOptions } from "../api/auth/[...nextauth]";
import prisma from "../../lib/util/prisma";
import { Saved } from "../../lib/types/saved.interface";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (session) {
    if (req.method === "GET") {
      return res.json(await fetchAllSaved(session));
    } else if (req.method === "POST") {
      const [status, data] = await addSavedItem(session, req.body);
      return res.status(status as number).json(data);
    } else if (req.method === "DELETE") {
      const [status, data] = await deleteSavedItem(session, req.body);
      return res.status(status as number).json(data);
    } else {
      return res.status(400).json({ error: "Invalid request method." });
    }
  } else {
    return res.status(401).json({ error: "No user available in session." });
  }
}

export async function fetchAllSaved(session: any): Promise<Saved[]> {
  if (!session) {
    return [];
  }

  const savedListResponse = await prisma.saved.findMany({
    where: {
      userId: session.user.id,
      active: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return savedListResponse.map(
    (item) =>
      ({
        id: item.id,
        title: item.title,
        url: item.url,
        alternativeUrl: item.alternativeUrl,
        createdAt: item.createdAt.valueOf(),
        updatedAt: item.updatedAt.valueOf(),
      } as Saved)
  );
}

export async function addSavedItem(session: any, body: any) {
  const addSavedItemSchema = Joi.object({
    title: Joi.string().required(),
    url: Joi.string().required(),
    alternativeUrl: Joi.string().allow(null),
  });

  const { error, value } = addSavedItemSchema.validate(body);

  if (error) {
    return [400, error];
  }

  const existingItem = await prisma.saved.findFirst({
    where: {
      userId: session.user.id,
      url: value.url,
      alternativeUrl: value.alternativeUrl,
      active: true,
    },
  });

  if (existingItem) {
    return [
      400,
      {
        error:
          "provided url and alternativeUrl combination is already saved for the user",
      },
    ];
  }

  const savedItem = await prisma.saved.create({
    data: {
      userId: session.user.id,
      title: value.title,
      url: value.url,
      alternativeUrl: value.alternativeUrl,
    },
  });

  return [200, savedItem];
}

export async function deleteSavedItem(session: any, body: any) {
  const deleteSavedItemSchema = Joi.object({
    id: Joi.number().required(),
  });

  const { error, value } = deleteSavedItemSchema.validate(body);

  if (error) {
    return [400, error];
  }

  try {
    await prisma.saved.updateMany({
      where: {
        id: value.id,
        userId: session.user.id,
      },
      data: {
        active: false,
      },
    });

    return [200, { message: "Deleted the saved item successfully!" }];
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2001") {
        return [
          400,
          {
            error: `Saved item with provided id doesn't exist for the user`,
          },
        ];
      }
    }
    throw e;
  }
}
