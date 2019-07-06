import { CLEAR_ERROR } from '../actions/types';

const initialState = {
  token: '',
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
      return {...state, ...action.data, isAuthenticated: true, isLoading: false, loginErrors: null};

    case 'REGISTRATION_SUCCESSFUL':
    return {...state, ...action.data, isAuthenticated: true, isLoading: false, registerErrors: null};

    case 'AUTHENTICATION_ERROR':
      return {...state, loginErrors: action.data, token: null, user: null,
        isAuthenticated: false, isLoading: false};

    case 'LOGIN_FAILED':
      return {...state, loginErrors: action.data, token: null, user: null,
        isAuthenticated: false, isLoading: false};

    case 'REGISTRATION_FAILED':
      return {...state, registerErrors: action.data, token: null, user: null,
        isAuthenticated: false, isLoading: false};

    case 'LOGOUT_SUCCESSFUL':
      console.log('i am logging out, true')
      return {...state, loginErrors: action.data, token: null, user: null,
        isAuthenticated: false, isLoading: false};
    case CLEAR_ERROR: return { ...state, 
                               loginErrors: null,
                               registerErrors: null
                             };

    default:
      return state;
  }
}
