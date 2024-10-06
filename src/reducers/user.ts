/* eslint-disable prettier/prettier */
interface User {
  _id: string;
  name: string;
  email: string;
  phno: string;
}

interface AuthState {
  data: {
    token: string;
    user: User;
  } | null;
}

interface AuthAction {
  type: 'AUTH';
  data: {
    token: string;
    user: User;
  };
}

interface LogoutAction {
  type: 'LOGOUT';
}

interface UpdateUserAction {
  type: 'UPDATE_USER';
  data: User;
}

type AuthActionTypes = AuthAction | LogoutAction | UpdateUserAction;

const initialState: AuthState = {
  data: null,
};

const userReducer = (state = initialState, action: AuthActionTypes): AuthState => {
  switch (action.type) {
    case 'AUTH':
      localStorage.setItem('Profile', JSON.stringify({ ...action.data }));
      return {
        ...state,
        data: action.data,
      };

    case 'UPDATE_USER':
      return {
        ...state,
        data: state.data
          ? { ...state.data, user: { ...state.data.user, ...action.data } }
          : null,
      };

    case 'LOGOUT':
      localStorage.clear();
      return {
        ...state,
        data: null,
      };

    default:
      return state;
  }
};
export default userReducer;
