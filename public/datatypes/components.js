// root = await import(`../components/root.js?t=${Date.now()}`).default;

import root from "../components/root.js"
import detail from "../components/detail.js";
import gbutton from "../components/gbutton.js";
import list from "../components/list.js";
import logo from "../components/logo.js";
import test from "../components/test.js";

export default [
  { name: "root", instance: root },
  { name: "detail", instance: detail },
  { name: "gbutton", instance: gbutton },
  { name: "list", instance: list },
  { name: "logo", instance: logo },
  { name: "test", instance: test },
];
