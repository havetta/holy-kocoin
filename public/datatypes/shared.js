
export async function post(data) {
  const rawResponse = await fetch('/post', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const content = await rawResponse.json();
  
  console.log(content);
}
