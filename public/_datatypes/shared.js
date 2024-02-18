
export async function post(url, data) {
  const rawResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  const content = await rawResponse.json();
  
  console.warn(content);
}
