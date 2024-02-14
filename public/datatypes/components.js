// root = await import(`../components/root.js?t=${Date.now()}`).default;

import root from "../components/root.js"
import detail from "../components/detail.js";
import gbutton from "../components/gbutton.js";
import listButtons from "../components/listButtons.js";
import listTable from "../components/listTable.js";
import list from "../components/list.js";
import logo from "../components/logo.js";
import preview from "../components/preview.js";
import sidebar from "../components/sidebar.js";
import test from "../components/test.js";

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
];
