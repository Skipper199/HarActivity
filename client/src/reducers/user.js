const defaultState = {
  username: '',
  email: '',
  token: '',
  isAdmin: '',
};

const userReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'INIT_USER':
      return action.data;
    case 'CHANGE_USERNAME':
      return { ...state, username: action.data };
    default:
      return state;
  }
};

export const setLoggedUser = (user) => {
  return (dispatch) => {
    dispatch({ type: 'INIT_USER', data: user });
  };
};

export default userReducer;
