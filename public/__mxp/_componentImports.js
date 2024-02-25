// root = await import(`root.js?t=${Date.now()}`).default;

import editform from "./editform.js";
import listButtons from "./listButtons.js";
import listTable from "./listTable.js";
import list from "./list.js";
import preview from "./preview.js";
import root from "./root.js"
import sidebar from "./sidebar.js";
//||
export default [
  { name: "editform", instance: editform },
  { name: "listButtons", instance: listButtons },
  { name: "listTable", instance: listTable },
  { name: "list", instance: list },
  { name: "preview", instance: preview },
  { name: "root", instance: root },
  { name: "sidebar", instance: sidebar },
];
