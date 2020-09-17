import { DATA_PATH } from '../config';

export async function retrieve(resource) {
  const resp = await fetch(`${DATA_PATH}/${resource}`);
  const type = resp.headers.get('Content-Type');
  if(type.startsWith('application/json'))
    return await resp.json();
  else if(type.startsWith('text/'))
    return await resp.text();
  else return await resp.arrayBuffer();
}
