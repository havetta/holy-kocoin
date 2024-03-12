
import { computed, h, reactive, ref, shallowRef, watch } from 'vue';
import { fetchJson } from '../_js/_functions.js';
import { globalStore, globalVars } from '../_globalVars.js';
export default {
  template: `
<dialog id="addSection" class="bg-gray-100 rounded-md p-4 w-[600px]">
  <section class="block max-w p-6 mb-6 border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
    <h5 class="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Create Section</h5>
    <article class="font-normal text-gray-700 dark:text-gray-100">
      <form class="max-w-sm mx-auto">
        <div class="mb-4">
        <label class="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" for="texthtml">
          Short Name
          <sup class="text-cyan-500 text-xs italic animate-pulse"> *** Don't use special chars.</sup>
        </label>
        <input type="text" data-id="shortname" aria-label="input" class="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      </div>
      </form>
    </article>
  </section>
  <div class="flex flex-row gap-x-3 w-full justify-end">
    <button @click="addnew()" class="btn-blue">Save</button>
    <button onclick="closeDialog('#addSection')" class="btn-blue">Cancel</button>
  </div>
</dialog>
  `,

//! /////////////////////////////////////////////////////////

  setup(props, { attrs, emit, expose, slots }) {

    return {
      ...globalStore,
      globalVars,

addnew: () => {
  const shortname = document.querySelector('#addSection input[data-id="shortname"]')?.value;

  const newItem = {
    id: crypto.randomUUID().split('-')[0],
    shortname,
  };

  globalStore?.currSectionList?.value?.unshift(newItem); // add new item as first in list
  fetchJson(`/section/?page=${globalStore?.currPgName?.value}`, 'put', newItem);
  closeDialog('#addSection');
},

mounted: () => {
  const ele = document.querySelector('#addSection input[data-id="shortname"]');
  ele.value = '';
},


    };
  },
  mounted() {
    if (this.mounted) this.mounted();
  },
}
