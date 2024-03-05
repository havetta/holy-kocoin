import { computed, h, reactive, ref, shallowRef, watch } from 'vue';
import { fetchJson } from '../_js/_functions.js';
import { globalStore, globalVars } from '../_globalVars.js';
export default {
  template: `
<section class="container p-4 mx-auto">
  <component :is="instance"></component>
</section>
`,

//! /////////////////////////////////////////////////////////

  setup(props, { attrs, emit, expose, slots }) {

    const instance = shallowRef({ template: '<span/>' });

    watch(
      () => globalVars?.currSection,
      async (old, cur) => {
        const page = globalStore?.currPgName?.value;
        const sectionName = globalStore?.currSectionList?.value?.find(
          (i) => i?.id === globalVars?.currSection.id,
        )?.shortname;
        try {
          instance.value = (
            await import(
              /* @vite-ignore */ `../${page}/${sectionName}.js?t=${Date.now()}`
            )
          ).default;
        } catch (e) {
          instance.value = (
            await import(
              /* @vite-ignore */ `../${page}/${sectionName}.js`
            )
          ).default;
        }
      },
      { deep: true },
    );

    return {
      ...globalStore,
      globalVars,
      instance,
    };
  },
  mounted() {
    if (this.mounted) this.mounted();
  },
}
