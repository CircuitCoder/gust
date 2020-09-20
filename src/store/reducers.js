export function listing(state = null, action) {
  if (action.type === 'LOAD_LIST') return action.list;
  return state;
}

export function folded(state = false, action) {
  if (action.type === 'FOLD_TITLE') return action.folded;
  return state;
}
