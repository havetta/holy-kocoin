export default {
  template: `
<div class="relative min-h-screen lg:flex">

  <sidebar/>

  <main id="content" class="flex-1 pb-12 space-y-6 overflow-y-auto lg:h-screen md:space-y-8">

    <section class="grid grid-cols-1 gap-8 px-6 xl:grid-cols-3 2xl:grid-cols-4 md:grid-cols-2">

      <list class="items-center"/>

      <detail class="pl-2 items-center"/>

      <preview class="pl-2 md:col-span-2 md:row-span-2 gap-y-4 gap-x-8"/>

      <div class="p-6 flex flex-col items-center">
        <button onclick="openDialog()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Open Modal
        </button>

        <gbutton/>
      </div>

      <dialog id="myDialog" class="bg-white rounded-md p-4">
        <p class="text-gray-700">Some text in the modal.</p>
        <button onclick="closeDialog()" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4">
          Close
        </button>
      </dialog>

    </section>

  </main>
</div>
`}
