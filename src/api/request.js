import { ErrorMessage, Authorization } from '../utils/constants';

export async function fetchApi(url, option) {
  let res;
  try {
    res = await fetch(url, option);
  } catch (error) {
    alert(ErrorMessage.fetchError);
  }
  const json = await res.json();
  if (!res.ok) {
    alert(json.message);
    throw new Error(json.message);
  }
  return json;
}

export function getOption(text) {
  return {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'omit',
    headers: {
      'Content-Type': 'text/plain',
      Authorization,
    },
    referrerPolicy: 'no-referrer',
    body: text,
  };
}

export function getOptionJson(data = {}) {
  return {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
      Authorization,
    },
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data),
  };
}

export function getOptionPdf(pdf) {
  return {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'omit',
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization,
    },
    referrerPolicy: 'no-referrer',
    body: pdf,
  };
}
