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
    <form>
      <label for="acronym">Acronym</label>
      <input :value="state.list.find(i => i?.id === state.selectedId)?.acronym" placeholder="Acronym" type="text" />
      <textarea :value="state.list.find(i => i?.id === state.selectedId)?.texthtml" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
      <textarea :value="state.list.find(i => i?.id === state.selectedId)?.textscript" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>

      <div class="flex flex-col gap-6 w-96">
        <div class="relative w-full min-w-[200px]">
          <textarea
            class="peer h-full min-h-[100px] w-full resize-none rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-green-500 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
            placeholder=" "></textarea>
          <label
            class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-green-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
            Textarea Green
          </label>
        </div>
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
