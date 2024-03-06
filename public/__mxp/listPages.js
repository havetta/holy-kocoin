
import { computed, h, reactive, ref, shallowRef, watch } from 'vue';
import { fetchJson, func } from '../_js/_functions.js';
import { globalStore, globalVars } from '../_globalVars.js';
export default {
  template: `
<select v-model="currPgName" size="3" class="hidden py-1 px-2 text-gray-700 placeholder-gray-400 bg-white border border-transparent border-gray-200 rounded-lg sm:w-auto w-36 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40">
  <option />
  <option v-for="item in pageList" :value="item.shortpgname">{{ item.shortpgname }}</option>
</select>

<ul class="hidden max-w-md divide-y divide-gray-200 dark:divide-gray-700">
  <li v-for="item in pageList" @click="currPgName = item.shortpgname" class="pb-3 sm:pb-4 py-1 px-2">
    <div class="flex items-center space-x-4 rtl:space-x-reverse">
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
          {{ item.shortpgname }}
        </p>
      </div>
    </div>
  </li>
</ul>

<section class="flex flex-col w-50 mt-4 px-5 py-3 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700 rounded-md">
  <div class="flex flex-col justify-between flex-1">
    <div>
      <div class="flex items-center justify-between">
        <h2 class="text-base font-semibold text-gray-800 dark:text-white">Pages</h2>

        <button onclick="openDialog('#addPage')" class="flex items-center gap-x-3 btn-blue hover:bg-gray-100 duration-200 transition-colors text-gray-500 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 border rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" />
          </svg>
          Create
        </button>
      </div>

      <nav class="mt-4 -mx-3 space-y-3 ">
        <button v-for="item in pageList" @click="currPgName = item.shortpgname" class="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700">
          <div class="flex items-center gap-x-2 ">
            <span class="w-2 h-2 bg-yellow-500 rounded-full"></span>
            <span>{{ item.shortpgname }}</span>
          </div>

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 rtl:rotate-180">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </nav>
    </div>
  </div>
</section>
  `,

//! /////////////////////////////////////////////////////////

  setup(props, { attrs, emit, expose, slots }) {

    const localVars = reactive({});

    return {
      ...globalStore,
      globalVars,
      localVars,

mounted: () => {
  watch(
    () => globalStore?.currPgName,
    (old, cur) => { localStorage.setItem('currPgName', cur.value) },
    { deep: true },
  );

  const currPgName = localStorage.getItem('currPgName');
  globalStore.currPgName.value = currPgName ?? '__mxp';
},

    };
  },
  mounted() {
    if (this.mounted) this.mounted(this);
  },
}
