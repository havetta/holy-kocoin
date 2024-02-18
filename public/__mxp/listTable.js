import state from "../datatypes/state.js";

export default {
  setup(props, { attrs, emit, expose, slots }) {

    return {
      state,
      pick: (item) => {
        state.value.selectedId = item?.id;
      },
    };
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
                  <input type="checkbox" class="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700">
                  <span>File name</span>
                </div>
              </th>
              <th scope="col" class="relative py-3.5 px-4">
                <span class="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
            <tr v-for="item in state.list">
              <td @click="pick(item)" class="w-full px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                <div class="inline-flex items-center gap-x-3">
                  <input type="checkbox" class="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700">

                  <div class="flex items-center gap-x-2">
                    <div>
                      <h2 class="font-normal text-gray-800 dark:text-white ">
                        {{ item?.name }}
                      </h2>
                      <p class="text-xs font-normal text-gray-500 dark:text-gray-400">{{ item?.id }}</p>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4 text-sm whitespace-nowrap">
                <button class="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg dark:text-gray-300 hover:bg-gray-100">
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
`};