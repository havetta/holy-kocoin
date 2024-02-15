import { reactive, ref, shallowRef, watch} from "vue";
import state from "../state.js"

export default {
  setup(props, { attrs, emit, expose, slots }) {
    let instance = reactive({template:'<span></span>'});

    watch(() => state, async (old, cur) => {
      const componentName = state.value.list.find(i => i?.id === state.value?.selectedId)?.name;
      try {
        const component = (await import(/* @vite-ignore */`./${componentName}.js?t=${Date.now()}`)).default;
        console.log(component);
        instance = component;
      } catch(e) {
        console.log(e);
        instance = (await import(/* @vite-ignore */`./${componentName}.js`)).default;
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
