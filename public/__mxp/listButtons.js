import state from "../_datatypes/state.js";

export default {
  setup(props, { attrs, emit, expose, slots }) {

    return {
      state,
      create: () => {
        state.value.list.unshift({
          id: crypto.randomUUID(),
          acronym: "Change_This_Acronym",
        });
      }
    };
  },
  template: `
<div class="sm:flex sm:items-center sm:justify-between">
  <h2 class="pr-4 pt-3 text-lg font-medium text-gray-800 dark:text-white">Components</h2>

  <div class="flex items-center mt-4 gap-x-3">
<!--    <button @click="create" class="btn-nofill">
      <svg class="w-5 h-5 group-hover:stroke-blue-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path class="group-hover:stroke-blue-700" d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" fill="#969CBA" fill-opacity="0.2" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        <path class="group-hover:stroke-blue-700" d="M13 2V9H20" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
      <span>Create</span>
    </button>
-->
    <button @click="create" class="btn-blue">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_3098_154395)">
        <path d="M13.3333 13.3332L9.99997 9.9999M9.99997 9.9999L6.66663 13.3332M9.99997 9.9999V17.4999M16.9916 15.3249C17.8044 14.8818 18.4465 14.1806 18.8165 13.3321C19.1866 12.4835 19.2635 11.5359 19.0351 10.6388C18.8068 9.7417 18.2862 8.94616 17.5555 8.37778C16.8248 7.80939 15.9257 7.50052 15 7.4999H13.95C13.6977 6.52427 13.2276 5.61852 12.5749 4.85073C11.9222 4.08295 11.104 3.47311 10.1817 3.06708C9.25943 2.66104 8.25709 2.46937 7.25006 2.50647C6.24304 2.54358 5.25752 2.80849 4.36761 3.28129C3.47771 3.7541 2.70656 4.42249 2.11215 5.23622C1.51774 6.04996 1.11554 6.98785 0.935783 7.9794C0.756025 8.97095 0.803388 9.99035 1.07431 10.961C1.34523 11.9316 1.83267 12.8281 2.49997 13.5832" stroke="currentColor" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <defs>
        <clipPath id="clip0_3098_154395">
        <rect width="20" height="20" fill="white"/>
        </clipPath>
        </defs>
      </svg>
      <span>Create</span>
    </button>
  </div>
</div>
`};