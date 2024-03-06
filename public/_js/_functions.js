export async function fetchJson(url, method, data) {
  const rawResponse = await fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responce = await rawResponse.json();
  console.log(responce);
}

export function func(name) {
  if (name === 'funcName') {

  }
}
