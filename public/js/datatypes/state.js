import { ref } from "vue";

export default ref({
  list: [{id: 1, name: 'test', template: '<component :is="logo"></component>'}, {id: 2, name: 'logo', template: '<logo />'}],
  selectedId: 1,
})
