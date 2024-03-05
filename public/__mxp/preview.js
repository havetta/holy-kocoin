import { shallowRef, watch } from 'vue';
import { globalStore, globalVars } from '../_globalVars.js';

export default {
  setup(props, { attrs, emit, expose, slots }) {
    const instance = shallowRef({ template: '<span></span>' });

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
      instance,
    };
  },
  template: `
<section class="container p-4 mx-auto">
  <component :is="instance"></component>
</section>
`,
};
