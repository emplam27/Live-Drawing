import React, { createContext, useContext, Dispatch, useReducer } from 'react';

type Action = { type: 'SET_CTX'; ctx: CanvasRenderingContext2D | null };

type CanvasCtxDispatch = Dispatch<Action>;

const CanvasCtxContext = createContext<CanvasRenderingContext2D | null>(null);
const CanvasCtxDispatchContext = createContext<CanvasCtxDispatch | null>(null);

function reducer(action: Action): CanvasRenderingContext2D | null {
  switch (action.type) {
    case 'SET_CTX':
      return action.ctx;
  }
}
export function CanvasCtxProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { ctx: null });

  return (
    <CanvasCtxContext.Provider value={state}>
      <CanvasCtxDispatchContext.Provider value={dispatch}>
        {children}
      </CanvasCtxDispatchContext.Provider>
    </CanvasCtxContext.Provider>
  );
}

export function useCanvasCtxState() {
  const CanvasCtx = useContext(CanvasCtxContext);
  if (!CanvasCtx) throw new Error('Cannot find SampleProvider'); // 유효하지 않을땐 에러를 발생
  return CanvasCtx;
}

export function useCanvasCtxDispatch() {
  const dispatch = useContext(CanvasCtxDispatchContext);
  if (!dispatch) throw new Error('Cannot find SampleProvider'); // 유효하지 않을땐 에러를 발생
  return dispatch;
}
