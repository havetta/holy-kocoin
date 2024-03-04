import { globalStore, globalVars } from '../_globalVars.js';
import { fetchJson } from '../_js/_functions.js';

export default {
  setup(props, { attrs, emit, expose, slots }) {
    return {
      pick: (item) => {
        hello();
      },
      
      addnew: () => {
        const newItem = {
          id: crypto.randomUUID().split('-')[0],
          shortname: 'Change_This',
        };

        globalStore?.currentSectionList?.value?.unshift(newItem); // add new item as first in list
        const page = globalStore?.currPgName?.value;
        fetchJson(`/section/?page=${page}`, 'post', newItem);
      },

      mounted: () => {
      },
      ...globalStore,
      globalVars,
    };
  },
  mounted() {
    if (this.mounted) this.mounted();
  },
  template: `
<div class="flex flex-col mt-6">
  <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div class="inline-block min-w-full py-2 align-middle md:px-2 lg:px-3">
      <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <div class="flex items-center gap-x-3">
                  <!--
                  <input type="checkbox" class="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700">
                  -->
                  <span :title="globalVars?.currSectionId" class="font-bold">Sections</span>
                </div>
              </th>
              <th scope="col" class="relative py-3.5 px-4">
                <div class="flex items-center">
                  <button @click="addnew()" class="btn-blue">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect fill="none" height="20" width="20"/>
                      <line fill="none" stroke="white" stroke-miterlimit="10" stroke-width="3" x1="3" x2="17" y1="10" y2="10"/>
                      <line fill="none" stroke="white" stroke-miterlimit="10" stroke-width="3" x1="10" x2="10" y1="3" y2="17"/>
                    </svg>
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
            <tr v-for="item in currentSectionList">
              <td @click="globalVars.currSectionId = item.id" class="w-full px-2 text-sm font-medium text-gray-700 whitespace-nowrap">
                <button class="inline-flex items-center gap-x-3 w-full px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700">
                  <!--
                  <input type="checkbox" class="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700">
                  -->

                  <div class="flex flex-col items-start">
                    <h2 class="font-normal text-gray-800 dark:text-white">
                      {{ item?.shortname }}
                    </h2>
                    <p class="text-xs font-normal text-gray-500 dark:text-gray-400">{{ item?.id }}</p>
                  </div>
                </button>
              </td>
              <td class="px-4 py-4 text-sm whitespace-nowrap text-end">
                <button @click="pick()" class="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg dark:text-gray-300 hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
`,
};
