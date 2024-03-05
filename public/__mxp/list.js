
import { computed, h, reactive, ref, shallowRef, watch } from 'vue';
import { fetchJson } from '../_js/_functions.js';
import { globalStore, globalVars } from '../_globalVars.js';
export default {
  template: `
<section class="container mx-auto">
  <listPages/>
  <listDialogAdd/>
  <listSections/>
</section>
  `,

//! /////////////////////////////////////////////////////////

  setup(props, { attrs, emit, expose, slots }) {

    return {
      ...globalStore,
      globalVars,



    };
  },
  mounted() {
    if (this.mounted) this.mounted();
  },
}
