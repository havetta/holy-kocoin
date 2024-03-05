import home from "./home.js";
import editform from "./editform.js";
import list from "./list.js";
import listDialogAdd from "./listDialogAdd.js";
import sidebar from "./sidebar.js";
import listSections from "./listSections.js";
import listPages from "./listPages.js";
import preview from "./preview.js";

export default [
  { name: "home", instance: home }, 
  { name: "editform", instance: editform }, 
  { name: "list", instance: list }, 
  { name: "listDialogAdd", instance: listDialogAdd }, 
  { name: "sidebar", instance: sidebar }, 
  { name: "listSections", instance: listSections }, 
  { name: "listPages", instance: listPages }, 
  { name: "preview", instance: preview }
];