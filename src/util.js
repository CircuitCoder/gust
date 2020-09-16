import { DATA_PATH } from './config';

export async function retrieve(resource) {
  const resp = await fetch(`${DATA_PATH}/${resource}`);
  const json = await resp.json();
  return json;
}
