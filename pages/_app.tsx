import { useCallback, useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import Image from "next/image";
import { Grid } from "@geist-ui/icons";
import { GeistProvider, CssBaseline, Link, Popover } from "@geist-ui/core";

import "../styles/globals.css";
import lightTheme from "../themes/light";
import darkTheme from "../themes/dark";
import MenuPopOver from "../components/MenuPopOver";

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
          content={
            <>
              <MenuPopOver themeType={themeType} setTheme={setTheme} />
            </>
          }
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
