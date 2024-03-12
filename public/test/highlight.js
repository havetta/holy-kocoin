
import { computed, h, reactive, ref, shallowRef, watch } from 'vue';
import { fetchJson, func } from '../_js/_functions.js';
import { globalStore, globalVars } from '../_globalVars.js';
export default {
  template: `
<div id="containerHtml1" style="height: 400px"></div>
<br/>
<div id="containerJs1" style="height: 300px"></div>

  `,

//! /////////////////////////////////////////////////////////

  setup(props, { attrs, emit, expose, slots }) {

    const localVars = reactive({});

    return {
      ...globalStore,
      globalVars,
      localVars,

mounted: () => {
  var editorHtml = monaco.editor.create(document.getElementById('containerHtml1'), {value: ['<div style="height: 20px">', '</div>'].join('\n'), language: 'html'});

  var editorJs = monaco.editor.create(document.getElementById('containerJs1'), {value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'), language: 'javascript'});

editorJs.getModel().setValue("export function func(name) {\n\
  if (name === 'highlightHtml') {\n\
    console.log('log fuction call here ...')\n\
  }\n\
}");
}

    };
  },
  mounted() {
    if (this.mounted) this.mounted(this);
  },
}
