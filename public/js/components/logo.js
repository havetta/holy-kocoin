import { h, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// import { useScriptTag, useStyleTag } from '@vueuse/core'  //  npm i @vueuse/core

export default {

  setup(props, { attrs, emit, expose, slots }) {
    const name = ref('hellouko');
    const mycomponent = h('div', { class: 'bg-red-200', innerHTML: 'hello' })//, slots.default({ text: name.value }))
    return {
      mycomponent: mycomponent,
      router: useRouter(),
    };
  },

  // render() {
  //   return h('div', { class: 'foo' }, [mycomponent])
  // },

  template: `
  <mycomponent/>
  <div class="logo" @click="router.push('/home')">
    <img src="/vite.svg" class="logo" alt="logo" />
  </div>
  `
}