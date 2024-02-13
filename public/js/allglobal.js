function openDialog() {
  const dialog = document.getElementById('myDialog');
  dialog.showModal();
  document.body.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
  document.querySelector('.text-gray-700').classList.add('animate-pulse');
}

function closeDialog() {
  const dialog = document.getElementById('myDialog');
  dialog.close();
  document.body.style.backgroundColor = '';
  document.querySelector('.text-gray-700').classList.remove('animate-pulse');
}