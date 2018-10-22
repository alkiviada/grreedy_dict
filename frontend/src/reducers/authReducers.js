import { CLEAR_ERROR } from '../actions/types';

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  isLoading: true,
  user: null,
  loginErrors: {},
  registerErrors: {},
};


export default function auth(state=initialState, action) {
  switch (action.type) {
    case 'USER_LOADING':
      return {...state, isLoading: true};

    case 'USER_LOADED':
      return {...state, isAuthenticated: true, isLoading: false, user: action.user};

    case 'LOGIN_SUCCESSFUL':
      localStorage.setItem("token", action.data.token);
      return {...state, ...action.data, isAuthenticated: true, isLoading: false, loginErrors: null};

    case 'REGISTRATION_SUCCESSFUL':
    localStorage.setItem("token", action.data.token);
    return {...state, ...action.data, isAuthenticated: true, isLoading: false, registerErrors: null};

    case 'AUTHENTICATION_ERROR':
      localStorage.removeItem("token");
      return {...state, loginErrors: action.data, token: null, user: null,
        isAuthenticated: false, isLoading: false};

    case 'LOGIN_FAILED':

    case 'LOGOUT_SUCCESSFUL':
      localStorage.removeItem("token");
      localStorage.removeItem("uuid");
      return {...state, loginErrors: action.data, token: null, user: null,
        isAuthenticated: false, isLoading: false};
    case CLEAR_ERROR: return { ...state, 
                               loginErrors: null
                             };

    default:
      return state;
  }
}
