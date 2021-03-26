import React, { createContext, useContext, Dispatch, useReducer } from 'react';

type ActiveLayer = {
  name: string | null;
  canvasId: string | null;
  buttonId: string | null;
  canvasCtx: CanvasRenderingContext2D | null;
};

type Action = {
  type: 'SET_ACTIVE_LAYER';
  layer: ActiveLayer;
};

type ActiveLayerDispatch = Dispatch<Action>;

const ActiveLayerContext = createContext<ActiveLayer>({
  name: null,
  canvasId: null,
  buttonId: null,
  canvasCtx: null,
});
const ActiveLayerDispatchContext = createContext<ActiveLayerDispatch>(
  () => null,
);

function reducer(activeLayer: ActiveLayer, action: Action): ActiveLayer {
  switch (action.type) {
    case 'SET_ACTIVE_LAYER':
      console.log('SET_ACTIVE_LAYER');
      return {
        name: action.layer.name,
        canvasId: action.layer.canvasId,
        buttonId: action.layer.buttonId,
        canvasCtx: action.layer.canvasCtx,
      };
  }
}

export function ActiveLayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, {
    name: null,
    canvasId: null,
    buttonId: null,
    canvasCtx: null,
  });

  return (
    <ActiveLayerDispatchContext.Provider value={dispatch}>
      <ActiveLayerContext.Provider value={state}>
        {children}
      </ActiveLayerContext.Provider>
    </ActiveLayerDispatchContext.Provider>
  );
}

export function useActiveLayerState(): ActiveLayer {
  const state = useContext(ActiveLayerContext);
  console.log('state :: ', state);
  if (!state) throw new Error('Cannot find ActiveLayer');
  return state;
}

export function useActiveLayerDispatch(): ActiveLayerDispatch {
  const dispatch = useContext(ActiveLayerDispatchContext);
  console.log('dispatch :: ', dispatch);
  if (!dispatch) throw new Error('Cannot find ActiveLayer');
  return dispatch;
}
