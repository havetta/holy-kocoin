import { app } from "./app.js"
import { stateCcxt } from "appImports"

import navBar from "./components/appHeader/navBar.js"
import navButton from "./components/appHeader/navButton.js"
import footer from "./components/appFooter/footer.js"
import tradePanel from "./components/tradePanel.js"
import rightSidePanel from "./components/rightSidePanel.js"

// Tag Name must be all lowercase
app.component("navbar", navBar );
app.component("navbutton", navButton );
app.component("appfooter", footer );
app.component("tradepanel", tradePanel );
app.component("rightsidepanel", rightSidePanel );

app.mount('#app');

//////////////////////////////////////////////////////////////////////////////
// CCXT library
(async () => {
  // await import("https://unpkg.com/ccxt"); // "https://unpkg.com/ccxt@1.92.30/dist/ccxt.browser.js"
  // stateCcxt.ccxt = ccxt;
})();
