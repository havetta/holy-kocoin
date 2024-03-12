
import { computed, h, reactive, ref, shallowRef, watch } from 'vue';
import { fetchJson, func } from '../_js/_functions.js';
import { globalStore, globalVars } from '../_globalVars.js';
export default {
  template: `
<div class="flex flex-col mx-auto gap-4">

  <logo1/>
  <section1/>
  <mySection/>
  <test1/>

</div>


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
