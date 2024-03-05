import { computed, reactive, ref } from 'vue';
import { fetchJson } from '../_js/_functions.js';
import { globalStore, globalVars } from '../_globalVars.js';

export default {
  setup(props, { attrs, emit, expose, slots }) {
    return {
      ...globalStore,
      globalVars,
      currSecName: computed(() => globalVars?.currSection?.shortname ?? 'home'),
      del: () => {
        const page = globalStore?.currPgName?.value;
        fetchJson(`/section/?page=${page}`, 'delete', {id: globalVars?.currSection?.id});
      },
      save: () => {
        // const currSection = globalStore?.currSectionList?.value?.find(
        //   (i) => i?.id === globalVars?.currSectionId,
        // );
        const page = globalStore?.currPgName?.value;
        fetchJson(`/section/?page=${page}`, 'post', {
          id: globalVars?.currSection?.id,
          shortname: globalVars?.currSection?.shortname,
          texthtml: globalVars?.currSection?.texthtml,
          textscript: globalVars?.currSection?.textscript,
        });
      },
    };
  },
  template: `
  <div class="m-4">
    <form class="shadow-md rounded p-6">
      <div class="mb-4">
        <label class="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" for="shortname">
          Short Name
          <sup class="text-cyan-500 text-xs italic animate-pulse"> *** Don't use special chars.</sup>
        </label>
        <input v-model="globalVars.currSection.shortname" class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="shortname" type="text" placeholder="shortname">
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" for="texthtml">
          HTML Template
        </label>
        <textarea v-model="globalVars.currSection.texthtml" rows="10" class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500  dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" for="textscript">
          Javascript
        </label>
        <textarea v-model="globalVars.currSection.textscript" rows="10" class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-sm text-gray-900 bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
      </div>

      <div class="flex items-center justify-between">
        <button @click="save()" class="flex items-center justify-center w-1/2 px-5 py-2 text-sm gap-x-2 tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg sm:w-auto hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
          <svg width="20" height="20" class="" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve">
            <path class="group-hover:stroke-blue-700" fill="#fff" stroke="#f00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M439.965,0H1.108v512h509.784V72.407L439.965,0z M74.251,73.143H293.68v110.823H74.251V73.143z M437.749,441.074H72.035 V257.108h365.714V441.074z M437.749,183.965h-70.926V73.143h42.625l28.302,29.339V183.965z">
            </path>
          </svg>
          Save
        </button>

        <button @click="del()" class="btn-nofill cursor-not-allowed">
          <svg class="w-5 h-5 group-hover:stroke-blue-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path class="group-hover:stroke-blue-700" d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" fill="#969CBA" fill-opacity="0.2" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            <path class="group-hover:stroke-blue-700" d="M13 2V9H20" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          <span>Delete</span>
        </button>

        <a :href="'?' + currPgName + '/' + currSecName + '/#/' + currPgName + '/' + globalVars?.currSection?.shortname ?? 'home'" target="_blank" class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
          Preview
        </a>
      </div>

    </form>
  </div>
  `,
};
