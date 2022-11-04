export default {
  template: `
  <li class="nav-item">
    <a class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-500 hover:shadow-lg focus:bg-blue-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-500 ease-in-out" data-mdb-ripple="true" data-mdb-ripple-color="light" role="button">
      <slot></slot>
    </a>
  </li>
  `
}
