import { Themes } from "@geist-ui/core";

export default Themes.createFromDark({
  type: "custom-dark",
  palette: {
    accents_1: "#424242",
    accents_2: "#424242",
    accents_5: "#fafafa",
    background: "#35363a",
    foreground: "#fafafa",
    selection: "#79ffe1",
    border: "#424242",
  },
  expressiveness: {
    dropdownBoxShadow: "0 0 0 1px #757575",
    shadowSmall: "0 0 0 1px #757575",
    shadowMedium: "0 0 0 1px #757575",
    shadowLarge: "0 0 0 1px #757575",
    portalOpacity: 0.75,
  },
});
