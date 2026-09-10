import React from "react";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider, useSelector, useDispatch } from "react-redux";

export const activeAppSlice = createSlice({
  name: "activeAppTitle",
  initialState: {
    title: "Home",
  },
  reducers: {
    changeActiveApp: (state, action) => {
      state.title = action.payload;
    },
  },
});

export const envVariablesSlice = createSlice({
  name: "envVariables",
  initialState: {
    env_apikey: process.env.API_KEY,
    env_username: process.env.USERNAME,
  },
  // reducers: {
  //   changeActiveApp: (state, action) => {
  //     state.title = action.payload;
  //   },
  // },
});

// Action creators are generated for each case reducer function
const { changeActiveApp } = activeAppSlice.actions;

const store = configureStore({
  reducer: {
    activeAppTitle: activeAppSlice.reducer,
    envVariables: envVariablesSlice.reducer,
  },
});

// we created this factory function useStore() as our custom hook to hide the redux from other apps. So we dont have to use react-redux hooks like useSelector(), useDispatch() in our MFE apps, we can just use the useStore that we exported to access those reducer functions and dispatch the state changes.
export const useStore = () => {
  const title = useSelector((state) => state.activeAppTitle.title);
  const env_apikey = useSelector((state) => state.envVariables.env_apikey);
  const env_username = useSelector((state) => state.envVariables.env_username);
  const dispatch = useDispatch();
  return {
    title,
    env_apikey,
    env_username,
    changeActiveApp: (payload) => dispatch(changeActiveApp(payload)),
  };
};

// This way we can use the StoreProvider by wrapping up on the children components, since we are exporting this provider we need to use children as props.
export const StoreProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
