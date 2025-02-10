import Image from "next/image";
import { Link, Popover, Text } from "@geist-ui/core";
import { Grid } from "@geist-ui/icons";

import metadata from "../lib/constants/metadata";
import MenuPopOver from "../components/MenuPopOver";

export default function Menu(props) {
  return (
    <>
      <Link
        href="/"
        className="logo"
        placeholder="keepup logo"
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
      >
        <Image
          src="/icons/icon-192x192.png"
          width={32}
          height={32}
          alt="keepup logo"
        />
      </Link>

      <div className="center">
        <Text h3 className="title">
          {metadata.title}
        </Text>
      </div>

      <Popover
        className="menu"
        // @ts-ignore
        content={
          <MenuPopOver
            themeType={props.themeType}
            setTheme={props.setTheme}
            parserIndex={props.parserIndex}
            feedConfig={props.feedConfig}
            savedItemsHook={props.savedItemsHook}
          />
        }
        hideArrow={true}
        placement="bottomEnd"
      >
        <Grid size={20} />
      </Popover>
    </>
  );
}
