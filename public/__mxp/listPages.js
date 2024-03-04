import { watch } from 'vue';
import { globalStore } from "../_globalVars.js";

export default {
  setup(props, { attrs, emit, expose, slots }) {

    watch(
      () => globalStore?.currPgName,
      (old, cur) => { localStorage.setItem('currPgName', cur.value) },
      { deep: true },
    );

    return {
      mounted: () => {
        const currPgName = localStorage.getItem('currPgName');
        globalStore.currPgName.value = currPgName ?? '__mxp';
      },
      ...globalStore,
    };
  },
  mounted() {
    if (this.mounted) this.mounted();
  },
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


<section class="flex flex-col w-50 mt-4 px-5 py-5 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700 rounded-md">
  <div class="flex flex-col justify-between flex-1">

    <nav class="hidden -mx-3 space-y-3 ">
      <a class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" href="#">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>

        <span class="mx-2 text-sm font-medium">Home</span>
      </a>

      <a class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" href="#">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
        </svg>

        <span class="mx-2 text-sm font-medium">Dashboard</span>
      </a>

      <a class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" href="#">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
        </svg>

        <span class="mx-2 text-sm font-medium">Projects</span>
      </a>

      <a class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" href="#">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
        </svg>

        <span class="mx-2 text-sm font-medium">Reporting</span>
      </a>

      <a class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" href="#">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>

        <span class="mx-2 text-sm font-medium">Users</span>
      </a>
    </nav>





    <div>
      <div class="flex items-center justify-between">
        <h2 class="text-base font-semibold text-gray-800 dark:text-white">Pages</h2>

        <button class="flex items-center gap-x-3 btn-blue hover:bg-gray-100 duration-200 transition-colors text-gray-500 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 border rounded-lg">
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
};
