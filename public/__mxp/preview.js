import { shallowRef, watch } from 'vue';

import pageStore from './_pageStore.js';
import { globalStore } from '../_globalStore.js';

export default {
  setup(props, { attrs, emit, expose, slots }) {
    const instance = shallowRef({ template: '<span></span>' });

    watch(
      () => pageStore?.selectedId,
      async (old, cur) => {
        const micropage = globalStore?.selectedPgName?.value;
        const componentName = globalStore?.currentList?.value?.find(
          (i) => i?.id === pageStore?.selectedId?.value,
        )?.shortname;
        try {
          instance.value = (
            await import(
              /* @vite-ignore */ `../${micropage}/${componentName}.js?t=${Date.now()}`
            )
          ).default;
        } catch (e) {
          instance.value = (
            await import(
              /* @vite-ignore */ `../${micropage}/${componentName}.js`
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
