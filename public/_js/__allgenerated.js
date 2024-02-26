function saveChanges() {
  alert('changed not saved...');
}

function openDialog(dialogid) {
  const dialog = document.getElementById(dialogid);
  dialog.showModal();
  document.body.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
}

function closeDialog(dialogid) {
  const dialog = document.getElementById(dialogid);
  dialog.close();
  document.body.style.backgroundColor = '';
}
