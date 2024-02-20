import state from "../_datatypes/state.js"
import { post } from "../_datatypes/shared.js";

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
        post(`/component/?microsite=${microsite}`, {
          id: crypto.randomUUID(),
          acronym: "Change.This.Name",
          texthtml: selectedItem?.texthtml,
          textscript: selectedItem?.textscript,
        });
      },
    }
  },
  template: `
  <div>
    <form class="shadow-md rounded p-6 mb-4">
      <div class="mb-4">
        <label for="acronym">Acronym: <sup class="p-1 border rounded-full">Will be in url and filename, don't use special chars.</sup></label>
        <input :value="state.list.find(i => i?.id === state.selectedId)?.acronym" placeholder="Acronym" type="text" />
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

      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
          Password
        </label>
        <input class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************">
        <p class="text-red-500 text-xs italic">Please choose a password.</p>
      </div>

      <div class="flex items-center justify-between">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
          Save
        </button>
        <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
          Link
        </a>
      </div>

    </form>

    <button class="btn-blue" @click="save()">
      Save
    </button>

    <button class="btn-green" @click="del()">
      Delete
    </button>
  </div>
  `
}
