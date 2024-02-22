// root = await import(`root.js?t=${Date.now()}`).default;

import root from "./root.js"
import detail from "./detail.js";
import gbutton from "./gbutton.js";
import listButtons from "./listButtons.js";
import listTable from "./listTable.js";
import list from "./list.js";
import logo from "./logo.js";
import preview from "./preview.js";
import sidebar from "./sidebar.js";
import test from "./test.js";
import test2 from "./test2.js";
//||
export default [
  { name: "root", instance: root },
  { name: "detail", instance: detail },
  { name: "gbutton", instance: gbutton },
  { name: "listButtons", instance: listButtons },
  { name: "listTable", instance: listTable },
  { name: "list", instance: list },
  { name: "logo", instance: logo },
  { name: "preview", instance: preview },
  { name: "sidebar", instance: sidebar },
  { name: "test", instance: test },
  { name: "test2", instance: test2 },
];
