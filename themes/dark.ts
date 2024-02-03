import { Themes } from "@geist-ui/core";

export default Themes.createFromDark({
  type: "custom-dark",
  palette: {
    accents_1: "#1e293b",
    accents_2: "#1e293b",
    accents_5: "#fafafa",
    background: "#020817",
    foreground: "#fafafa",
    border: "#1e293b",
  },
  expressiveness: {
    dropdownBoxShadow: "0 0 0 2px #1e293b",
    shadowSmall: "0 0 0 2px #1e293b",
    shadowMedium: "0 0 0 2px #1e293b",
    shadowLarge: "0 0 0 2px #1e293b",
    portalOpacity: 0.75,
  },
});
