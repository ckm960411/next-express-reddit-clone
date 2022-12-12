import { createContext, ReducerAction, useContext, useReducer } from 'react';
import { User } from '../types';

interface State {
  authenticated: boolean;
  user: User | undefined;
  loading: boolean;
}

const StateContext = createContext<State>({
  authenticated: false,
  user: undefined,
  loading: true,
});

const DispatchContext = createContext<any>(null);

interface Action {
  type: string;
  payload: any;
}
const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
    case 'LOGIN':
      return {
        ...state,
        authenticated: true,
        user: payload.user,
      };
    case 'LOGOUT':
      return {
        ...state,
        authenticated: false,
        user: undefined,
      };
    case 'STOP_LOADING':
      return {
        ...state,
        loading: false,
      };
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, defaultDispatch] = useReducer(reducer, {
    user: undefined,
    authenticated: false,
    loading: true,
  });

  const dispatch = (type: string, payload?: any) => {
    defaultDispatch({ type, payload });
  };

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
