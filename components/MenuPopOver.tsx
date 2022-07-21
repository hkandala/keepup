import { signIn, signOut, useSession } from "next-auth/react";
import {
  Button,
  Divider,
  Drawer,
  Modal,
  Text,
  useModal,
  User,
} from "@geist-ui/core";
import {
  Bookmark,
  Clock,
  Coffee,
  Emoji,
  Github,
  Info,
  LogOut,
  Moon,
  Sliders,
  Sun,
} from "@geist-ui/icons";
import { useState } from "react";
import ManageFeed from "./ManageFeed";

export default function MenuPopOver(props) {
  const { data: session, status } = useSession();
  const { visible, setVisible, bindings } = useModal();
  const [feedDrawerVisibility, setFeedDrawerVisibility] = useState(false);

  return (
    <div className="menu-wrapper">
      {status === "authenticated" ? (
        <User
          name={session.user.name}
          src={session.user.image}
          text={session.user.name
            .split(/\s/)
            .reduce((response, word) => (response += word.slice(0, 1)), "")}
        >
          <span className="email-text">{session.user.email}</span>
        </User>
      ) : (
        <Button
          type="secondary"
          icon={<Github />}
          auto
          onClick={() => signIn("github")}
        >
          Sign in with Github
        </Button>
      )}
      <Divider my={2} h={2} />
      <Button
        type="abort"
        icon={<Bookmark />}
        className={
          status !== "authenticated" ? "menu-button disabled" : "menu-button"
        }
        auto
      >
        Saved
      </Button>
      <Button
        type="abort"
        icon={<Clock />}
        className={
          status !== "authenticated" ? "menu-button disabled" : "menu-button"
        }
        auto
      >
        History
      </Button>
      <Button
        type="abort"
        icon={<Sliders />}
        className={
          status !== "authenticated" ? "menu-button disabled" : "menu-button"
        }
        auto
        onClick={() => setFeedDrawerVisibility(true)}
      >
        Manage Feed
      </Button>
      {status === "authenticated" ? (
        <Button
          type="abort"
          icon={<LogOut />}
          className="menu-button"
          auto
          onClick={() => signOut()}
        >
          Sign Out
        </Button>
      ) : (
        <></>
      )}
      <Divider my={1} h={2} />
      {props.themeType === "light" ? (
        <Button
          type="abort"
          icon={<Moon />}
          className="menu-button"
          auto
          onClick={() => props.setTheme("dark")}
        >
          Dark Theme
        </Button>
      ) : (
        <Button
          type="abort"
          icon={<Sun />}
          className="menu-button"
          auto
          onClick={() => props.setTheme("light")}
        >
          Light Theme
        </Button>
      )}
      <Divider my={1} h={2} />
      <Button
        type="abort"
        icon={<Info />}
        className="menu-button remove-text-transform"
        auto
        onClick={() => setVisible(true)}
      >
        About <em>&nbsp;keepup</em>
      </Button>

      {/* About Modal */}
      <Modal {...bindings} wrapClassName="about-modal">
        <Modal.Title className="remove-text-transform">
          About <em>&nbsp;keepup</em>
        </Modal.Title>
        <Modal.Content>
          <Text small>
            As a developer, I regularly visit various websites to stay up to
            date with tech trends. <em>keepup</em> is a simple web app that
            aggregates links from multiple sources on to a single page. Built as
            a part of{" "}
            <a href="https://planetscale.com/" target="_blank" rel="noreferrer">
              planetscale
            </a>{" "}
            x{" "}
            <a href="https://hashnode.com/" target="_blank" rel="noreferrer">
              hashnode
            </a>{" "}
            hackathon.
          </Text>
        </Modal.Content>
        <Modal.Action>
          <a
            href="https://github.com/hkandala/keep-up"
            target="_blank"
            rel="noreferrer"
          >
            <Github />
          </a>
        </Modal.Action>
        <Modal.Action>
          <a
            href="https://www.buymeacoffee.com/hkandala"
            target="_blank"
            rel="noreferrer"
          >
            <Coffee />
          </a>
        </Modal.Action>
        <Modal.Action>
          <a href="https://hkandala.dev/" target="_blank" rel="noreferrer">
            <Emoji />
          </a>
        </Modal.Action>
      </Modal>

      {/* Manage Feed Drawer */}
      <Drawer
        id="feed-drawer"
        visible={feedDrawerVisibility}
        onClose={() => setFeedDrawerVisibility(false)}
        placement="right"
      >
        <Drawer.Title>Manage Feed</Drawer.Title>
        <Drawer.Content>
          <ManageFeed />
        </Drawer.Content>
      </Drawer>
    </div>
  );
}
