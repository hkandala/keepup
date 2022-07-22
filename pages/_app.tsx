import { useCallback, useEffect, useState } from "react";
import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { GeistProvider, CssBaseline } from "@geist-ui/core";

import "../styles/globals.css";
import lightTheme from "../themes/light";
import darkTheme from "../themes/dark";

export default function MyApp({ Component, pageProps }: AppProps) {
  const [themeType, setThemeType] = useState("dark");

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

  const props = { ...pageProps, themeType, setTheme };

  return (
    <SessionProvider session={pageProps.session}>
      <GeistProvider
        themes={[lightTheme, darkTheme]}
        themeType={themeType == "dark" ? "custom-dark" : "custom-light"}
      >
        <CssBaseline />
        <Component {...props} />
      </GeistProvider>
    </SessionProvider>
  );
}
