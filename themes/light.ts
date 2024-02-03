import { Themes } from "@geist-ui/core";

export default Themes.createFromLight({
  type: "custom-light",
  palette: {
    accents_1: "#eaeaea",
    accents_5: "#212121",
    background: "#fafafa",
    foreground: "#212121",
    border: "#e0e0e0",
  },
  expressiveness: {
    dropdownBoxShadow: "0 0 0 2px #e0e0e0",
    shadowSmall: "0 0 0 2px #e0e0e0",
    shadowMedium: "0 0 0 2px #e0e0e0",
    shadowLarge: "0 0 0 2px #e0e0e0",
    portalOpacity: 0.75,
  },
});
