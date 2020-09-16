import { loadList } from './simple';
import { retrieve } from '../util';

export const fetchList = () => async dispatch => {
  const listing = await retrieve('listing.json');
  dispatch(loadList(listing));
}
