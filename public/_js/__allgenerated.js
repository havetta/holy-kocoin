function generatePptx()
{
  console.log(pptx.version);
  const slide = pptx.addSlide();

  const img = `/_mockdata/image.jpeg?t=${Date.now()}`;
  var width = 1024;
  var height = 1080;
  
  slide.addImage({
    path: img,
    x: 0,
    y: 0,
    w: 10,
    h: 10 * height / width
  });
  pptx.writeFile({ fileName: '11-demo.pptx' });
}

function hello() {
  console.log(`Hello, let's grab a cup of coffee...`);
  alert(`Hello, let's grab a cup of coffee...`);
}

function saveChanges() {
  alert('changed not saved...');
}

function openDialog(dialogid) {
  const dialog = document.querySelector(dialogid);
  dialog.showModal();
  document.body.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
}

function closeDialog(dialogid) {
  const dialog = document.querySelector(dialogid);
  dialog.close();
  document.body.style.backgroundColor = '';
}
