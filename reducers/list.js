export const list = (state = {}, action) => {

  switch (action.type) {

    // overwrite list items with updated results 
    case 'UPDATE_LIST_RESULTS':

      const nState = Object.assign({}, state, {
        items: action.items
      });
      return nState;

    default:
      return state;
  }
}

export default list;