
import { computed, h, reactive, ref, shallowRef, watch } from 'vue';
import { fetchJson, func } from '../_js/_functions.js';
import { globalStore, globalVars } from '../_globalVars.js';
export default {
  template: `
<div class="flex flex-row mx-auto">
  <test1/>
  <logo1/>
  <section1/>
</div>
xxx
<mySection></mySection>
  `,

//! /////////////////////////////////////////////////////////

  setup(props, { attrs, emit, expose, slots }) {

    const localVars = reactive({});

    return {
      ...globalStore,
      globalVars,
      localVars,

mounted: () => {
  console.log('demo mounted');
},


    };
  },
  mounted() {
    if (this.mounted) this.mounted(this);
  },
}
