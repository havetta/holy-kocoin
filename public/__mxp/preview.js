import { ref, shallowRef, watch} from "vue";
import state from "../datatypes/state.js"

export default {
  setup(props, { attrs, emit, expose, slots }) {
    const instance = shallowRef({template:'<span></span>'});

    watch(() => state, async (old, cur) => {
      const microsite = "__mxp"
      const componentName = state.value.list.find(i => i?.id === state.value?.selectedId)?.name;
      try {
        instance.value = (await import(/* @vite-ignore */`../${microsite}/${componentName}.js?t=${Date.now()}`)).default;
      } catch(e) {
        instance.value = (await import(/* @vite-ignore */`../${microsite}/${componentName}.js`)).default;
      }
    }, { deep: true });

    return {
      instance,
      state,
    }
  },
  template: `
<section class="container p-4 mx-auto">
  <component :is="instance"></component>
</section>
`}
