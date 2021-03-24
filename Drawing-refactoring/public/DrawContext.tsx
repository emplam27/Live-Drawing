// import React, { createContext, useContext, Dispatch, useReducer } from 'react';

// type CanvasCtxs = { [key: string]: CanvasRenderingContext2D };

// type Action = {
//   type: 'SET_CANVAS_CTX';
//   name: string;
//   ctx: CanvasRenderingContext2D;
// };

// type CanvasCtxsDispatch = Dispatch<Action>;

// const CanvasCtxsContext = createContext<CanvasCtxs | null>(null);
// const CanvasCtxsDispatchContext = createContext<CanvasCtxsDispatch | null>(
//   null,
// );

// function reducer(canvasCtx: CanvasCtxs, action: Action): CanvasCtxs {
//   switch (action.type) {
//     case 'SET_CANVAS_CTX':
//       return {
//         ...canvasCtx,
//         [action.name]: action.ctx,
//       };
//   }
// }

// export function CanvasCtxsProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [state, dispatch] = useReducer(reducer, {});

//   return (
//     <CanvasCtxsContext.Provider value={state}>
//       <CanvasCtxsDispatchContext.Provider value={dispatch}>
//         {children}
//       </CanvasCtxsDispatchContext.Provider>
//     </CanvasCtxsContext.Provider>
//   );
// }

// export function useCanvasCtxsState() {
//   const CanvasCtx = useContext(CanvasCtxsContext);
//   if (!CanvasCtx) throw new Error('Cannot find CanvasCtx');
//   return CanvasCtx;
// }

// export function useCanvasCtxsDispatch() {
//   const dispatch = useContext(CanvasCtxsDispatchContext);
//   if (!dispatch) throw new Error('Cannot find CanvasCtx');
//   return dispatch;
// }
