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

<div class="p-6 flex flex-col items-center">
  <button onclick="openDialog('someDialog')" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    Open Modal
  </button>

  <mybutton/>
</div>

<section class="pointer-events-none relative w-auto translate-y-[-50px] transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px]">
<dialog id="someDialog">
  <div class="min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600">
    <div class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
      <!--Modal title-->
      <h5
        class="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200"
        id="exampleModalLabel">
        Modal title
      </h5>
      <!--Close button-->
      <button onclick="closeDialog('someDialog')"
        type="button"
        class="hover:bg-blue-500 rounded-3xl p-2 box-content border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
        data-te-modal-dismiss
        aria-label="Close">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-6 w-6">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!--Modal body-->
    <div class="relative flex-auto p-4" data-te-modal-body-ref>
      Modal body text goes here.
    </div>

    <!--Modal footer-->
    <div
      class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
      <button onclick="closeDialog('someDialog')"
        type="button"
        class="hover:bg-blue-500 inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
        data-te-modal-dismiss
        data-te-ripple-init
        data-te-ripple-color="light">
        Close
      </button>
      <button onclick="saveChanges();closeDialog('someDialog')"
        type="button"
        class="hover:bg-blue-500 ml-1 inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
        data-te-ripple-init
        data-te-ripple-color="light">
        Save changes
      </button>
    </div>
  </div>
</dialog>
</section>
  `
}
