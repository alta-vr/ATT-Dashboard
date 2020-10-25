"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const styled_components_1 = require("styled-components");
const GlobalStyle = styled_components_1.createGlobalStyle `
  html,
  body {
    height: 100%;
    width: 100%;
  }

  /* body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  } */

  #app {
    padding-top: 1em;
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
    height: max(fit-content, 100%);
  }

  #app>div
  {
    width: 90%;
  }

  /* p,
  label {
    font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  } */
`;
exports.default = GlobalStyle;
