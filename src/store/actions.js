import { loadList } from './simple';
import { retrieve } from '../utils/networking';

export const fetchList = () => async dispatch => {
  const listing = await retrieve('listing.json');
  dispatch(loadList(listing));
}
