import { Themes } from "@geist-ui/core";

export default Themes.createFromLight({
  type: "custom-light",
  palette: {
    accents_1: "#eaeaea",
    background: "#fafafa",
    foreground: "#212121",
    border: "#e0e0e0",
  },
  expressiveness: {
    dropdownBoxShadow: "0 0 0 1px #bdbdbd",
    shadowSmall: "0 0 0 1px #bdbdbd",
    shadowMedium: "0 0 0 1px #bdbdbd",
    shadowLarge: "0 0 0 1px #bdbdbd",
    portalOpacity: 0.75,
  },
});
