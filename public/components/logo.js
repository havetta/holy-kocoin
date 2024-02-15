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
<div class="logo" @click="router?.push('/test')">
  <img src="/vite.svg" class="logo" alt="logo" />
</div>
<button href="/?page=test" class="btn-blue m-6">
  <h1>button</h1>
</button>
<a href="/?page=test2" class="btn-green m-6">
  <h1>Open component TEST2</h1>
</a>

<div class="p-6 flex flex-col items-center">
  <button onclick="openDialog()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    Open Modal
  </button>

  <gbutton/>
</div>


<dialog id="myDialog" class="bg-white rounded-md p-4">
<p class="text-gray-700">Some text in the modal.</p>
<button onclick="closeDialog()" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4">
  Close
</button>
</dialog>
  `
}