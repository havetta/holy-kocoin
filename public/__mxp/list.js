
import { computed, h, reactive, ref, shallowRef, watch } from 'vue';
import { fetchJson, func } from '../_js/_functions.js';
import { globalStore, globalVars } from '../_globalVars.js';
export default {
  template: `
<section class="container mx-auto">
  <listPagesAdd/>
  <listPages/>
  <listSectionAdd/>
  <listSections/>
</section>
  `,

//! /////////////////////////////////////////////////////////

  setup(props, { attrs, emit, expose, slots }) {

    const localVars = reactive({});

    return {
      ...globalStore,
      globalVars,
      localVars,



    };
  },
  mounted() {
    if (this.mounted) this.mounted(this);
  },
}
