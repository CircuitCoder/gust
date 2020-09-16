export function listing(state = null, action) {
  if(action.type === 'LOAD_LIST')
    return action.list;
  return state;
}
