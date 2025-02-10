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
  Coffee,
  Emoji,
  Github,
  Heart,
  Info,
  LogOut,
  Moon,
  Sliders,
  Sun,
} from "@geist-ui/icons";
import { useState } from "react";

import ManageFeed from "./ManageFeed";
import SavedList from "./SavedList";

export default function MenuPopOver(props) {
  const { data: session, status } = useSession();
  const { visible, setVisible, bindings } = useModal();
  const [feedDrawerVisibility, setFeedDrawerVisibility] = useState(false);
  const [savedDrawerVisibility, setSavedDrawerVisibility] = useState(false);

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
          placeholder="Github Sign In Button"
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          Sign in with Github
        </Button>
      )}
      <Divider my={2} h={2} />
      <Button
        type="abort"
        icon={<Heart />}
        className={
          status !== "authenticated" ? "menu-button disabled" : "menu-button"
        }
        auto
        onClick={() => {
          if (status === "authenticated") {
            setSavedDrawerVisibility(true);
          }
        }}
        placeholder="Saved Button"
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
      >
        Saved
      </Button>
      <Button
        type="abort"
        icon={<Sliders />}
        className={
          status !== "authenticated" ? "menu-button disabled" : "menu-button"
        }
        auto
        onClick={() => {
          if (status === "authenticated") {
            setFeedDrawerVisibility(true);
          }
        }}
        placeholder="Manage Feed Button"
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
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
          placeholder="Log Out Button"
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
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
          placeholder="Dark Theme Button"
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
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
          placeholder="Light Theme Button"
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
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
        placeholder="Info Button"
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
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
            aggregates links from multiple sources on to a single page.
          </Text>
        </Modal.Content>
        <Modal.Action
          placeholder="Action"
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          <a
            href="https://github.com/hkandala/keepup"
            target="_blank"
            rel="noreferrer"
          >
            <Github />
          </a>
        </Modal.Action>
        <Modal.Action
          placeholder="Action"
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          <a
            href="https://www.buymeacoffee.com/hkandala"
            target="_blank"
            rel="noreferrer"
          >
            <Coffee />
          </a>
        </Modal.Action>
        <Modal.Action
          placeholder="Action"
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
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
        <Drawer.Content>
          <Text h3 className="center">
            Manage Feed
          </Text>
          <ManageFeed
            parserIndex={props.parserIndex}
            feedConfig={props.feedConfig}
          />
        </Drawer.Content>
      </Drawer>

      {/* Saved Drawer */}
      <Drawer
        id="saved-drawer"
        visible={savedDrawerVisibility}
        onClose={() => setSavedDrawerVisibility(false)}
        placement="right"
      >
        <Drawer.Content>
          <Text h3 className="center">
            Saved
          </Text>
          <SavedList savedItemsHook={props.savedItemsHook} />
        </Drawer.Content>
      </Drawer>
    </div>
  );
}
