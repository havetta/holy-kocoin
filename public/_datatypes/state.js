import { ref } from "vue";

export default ref({
  list: [
    {id: 1, shortname: `test`, texthtml: `<component :is="logo"></component>`, textscript: `return { clickme: () => { console.log('clickme', "quote")}, };`},
    {id: 2, shortname: 'logo', texthtml: '<logo />', textscript: `return { clickme: () => { console.log('clickme')}, };`},
    {id: 3, shortname: 'test2', texthtml: '<flowbite />', textscript: `return { clickme: () => { console.log('clickme')}, }; },`},
  ],
  selectedId: 1,
})
