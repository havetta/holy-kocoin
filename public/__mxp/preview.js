
import { computed, h, reactive, ref, shallowRef, watch } from 'vue';
import { fetchJson } from '../_js/_functions.js';
import { globalStore, globalVars } from '../_globalVars.js';
export default {
  template: `
<section class="container p-4 mx-auto">
  <component :is="localVars?.previewComponent"></component>
</section>
  `,

//! /////////////////////////////////////////////////////////

  setup(props, { attrs, emit, expose, slots }) {

    const localVars = reactive({});

    return {
      ...globalStore,
      globalVars,
      localVars,

mounted: () => {
  watch(
    () => globalVars?.currSection,
    async (old, cur) => {
      const page = globalStore?.currPgName?.value;
      const sectionName = globalStore?.currSectionList?.value?.find(
        (i) => i?.id === globalVars?.currSection.id,
      )?.shortname;
      try {
        localVars.previewComponent = (
          await import(
            /* @vite-ignore */ `../${page}/${sectionName}.js?t=${Date.now()}`
          )
        ).default;
      } catch (e) {
        localVars.previewComponent = (
          await import(
            /* @vite-ignore */ `../${page}/${sectionName}.js`
          )
        ).default;
      }
    },
    { deep: true },
  );
},

    };
  },
  mounted() {
    if (this.mounted) this.mounted(this);
  },
}
