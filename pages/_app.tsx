import { useCallback, useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import Image from "next/image";
import {
  Github,
  Grid,
  Bookmark,
  Clock,
  Sliders,
  Sun,
  Moon,
  Info,
} from "@geist-ui/icons";
import {
  GeistProvider,
  CssBaseline,
  Divider,
  Link,
  Popover,
  Button,
} from "@geist-ui/core";

import "../styles/globals.css";
import lightTheme from "../themes/light";
import darkTheme from "../themes/dark";

function MyApp({ Component, pageProps }: AppProps) {
  const [themeType, setThemeType] = useState("light");

  const setTheme = useCallback(
    (theme: "light" | "dark") => {
      if ((theme === "light" || theme === "dark") && themeType !== theme) {
        window.localStorage.setItem("theme", theme);
        setThemeType(theme);
      }
    },
    [themeType]
  );

  useEffect(() => {
    const isSystemDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const storedTheme = window.localStorage.getItem("theme");
    if ((!storedTheme && isSystemDarkMode) || storedTheme == "dark") {
      setTheme("dark");
    }
  }, [setTheme]);

  const popoverContent = () => (
    <div style={{ padding: "10px 20px" }}>
      <Button type="secondary" icon={<Github />} auto>
        Sign in with Github
      </Button>
      <Divider my={2} h={2} />
      <Button type="abort" icon={<Bookmark />} auto>
        Saved
      </Button>
      <Button type="abort" icon={<Clock />} auto>
        History
      </Button>
      <Button type="abort" icon={<Sliders />} auto>
        Manage Feed
      </Button>
      <Divider my={1} h={2} />
      {themeType === "light" ? (
        <Button
          type="abort"
          icon={<Moon />}
          auto
          onClick={() => setTheme("dark")}
        >
          Dark Theme
        </Button>
      ) : (
        <Button
          type="abort"
          icon={<Sun />}
          auto
          onClick={() => setTheme("light")}
        >
          Light Theme
        </Button>
      )}
      <Divider my={1} h={2} />
      <Button
        type="abort"
        icon={<Info />}
        auto
        style={{ textTransform: "none" }}
      >
        About <em>&nbsp;keepup</em>
      </Button>
    </div>
  );

  return (
    <SessionProvider session={pageProps.session}>
      <GeistProvider
        themes={[lightTheme, darkTheme]}
        themeType={themeType == "dark" ? "custom-dark" : "custom-light"}
      >
        <CssBaseline />

        <Link href="/" className="logo">
          <Image
            src="/icons/icon-192x192.png"
            width={32}
            height={32}
            alt="keepup logo"
          />
        </Link>

        <Popover
          className="menu"
          content={popoverContent}
          hideArrow={true}
          placement="bottomEnd"
        >
          <Grid size={20} />
        </Popover>

        <Component {...pageProps} />
      </GeistProvider>
    </SessionProvider>
  );
}

export default MyApp;
