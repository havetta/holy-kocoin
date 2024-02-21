import state from "../_datatypes/state.js"
import { fetchJson } from "../_datatypes/shared.js";

export default {
  setup(props, { attrs, emit, expose, slots }) {
    return {
      state,
      del: () => {},
      save: () => {
        const selectedItem = state?.value?.list?.find(i => i?.id === state?.value?.selectedId);
        console.log(selectedItem?.acronym);
        console.log(selectedItem?.texthtml)
        console.log(selectedItem?.textscript)
        const microsite = `__mxp`;
        fetchJson(`/component/?microsite=${microsite}`, 'put', {
          id: crypto.randomUUID(),
          acronym: "Change.This.Name",
          texthtml: selectedItem?.texthtml,
          textscript: selectedItem?.textscript,
        });
      },
    }
  },
  template: `
  <div class="m-4">
    <form class="shadow-md rounded p-6">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="acronym">
          Acronym
          <sup class="text-cyan-500 text-xs italic"> *** Don't use special chars.</sup>
        </label>
        <input :value="state.list.find(i => i?.id === state.selectedId)?.acronym" class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="acronym" type="text" placeholder="Acronym">
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="texthtml">
          HTML Template
        </label>
        <textarea :value="state.list.find(i => i?.id === state.selectedId)?.texthtml" rows="10" class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-sm rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500  dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="textscript">
          Javascript
        </label>
        <textarea :value="state.list.find(i => i?.id === state.selectedId)?.textscript" rows="10" class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
      </div>

      <div class="flex items-center justify-between">
        <button @click="save()" class="flex items-center justify-center w-1/2 px-5 py-2 text-sm gap-x-2 tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg sm:w-auto hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
          <svg width="20" height="20" class="" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve">
            <path class="group-hover:stroke-blue-700" fill="#fff" stroke="#f00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M439.965,0H1.108v512h509.784V72.407L439.965,0z M74.251,73.143H293.68v110.823H74.251V73.143z M437.749,441.074H72.035 V257.108h365.714V441.074z M437.749,183.965h-70.926V73.143h42.625l28.302,29.339V183.965z">
            </path>
          </svg>
          Save
        </button>
        <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
          Delete
        </a>
      </div>

    </form>
  </div>
  `
}
