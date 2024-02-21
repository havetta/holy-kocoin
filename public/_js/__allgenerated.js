function openDialog(dialogid) {
  const dialog = document.getElementById(dialogid);
  dialog.showModal();
  document.body.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
  document.querySelector('.text-gray-700').classList.add('animate-pulse');
}

function closeDialog(dialogid) {
  const dialog = document.getElementById(dialogid);
  dialog.close();
  document.body.style.backgroundColor = '';
  document.querySelector('.text-gray-700').classList.remove('animate-pulse');
}