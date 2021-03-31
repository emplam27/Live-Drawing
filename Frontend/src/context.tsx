import React, { useReducer, useContext, createContext, Dispatch } from 'react';

type State = {
  name: string;
  token: string;
};

type Action = { type: 'SET_ID'; name: string; token: string };
type DispatchType = Dispatch<Action>;

const StateContext = createContext<State | null>(null);
const DispatchContext = createContext<DispatchType | null>(null);

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_ID':
      return {
        ...state,
        name: action.name,
        token: action.token,
      };
    default:
      throw new Error('Unhandled action');
  }
};

export function Provider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    name: '',
    token: '',
  });

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export const useCustomState = () => {
  const state = useContext(StateContext);
  if (!state) throw new Error('Cannot find Provider');
  return state;
};

export const useCustomDispatch = () => {
  const dispatch = useContext(DispatchContext);
  if (!dispatch) throw new Error('Cannot find Provider');
  return dispatch;
};
