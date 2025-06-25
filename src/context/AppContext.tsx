import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Member, Remark } from "../types";
import axios from "axios";
import axiosInstance from "../axiosInstance";

interface AppState {
  members: Member[];
  remarks: Remark[];
  loading: boolean;
}

type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_MEMBERS"; payload: Member[] }
  | { type: "ADD_MEMBER"; payload: Member }
  | { type: "DELETE_MEMBER"; payload: string }
  | { type: "SET_REMARKS"; payload: Remark[] }
  | { type: "ADD_REMARK"; payload: Remark }
  | { type: "DELETE_REMARK"; payload: string };

const initialState: AppState = {
  members: [],
  remarks: [],
  loading: false,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({ state: initialState, dispatch: () => null });

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_MEMBERS":
      return { ...state, members: action.payload };
    case "ADD_MEMBER":
      return { ...state, members: [...state.members, action.payload] };
    case "DELETE_MEMBER":
      return {
        ...state,
        members: state.members.filter((m) => m.id !== action.payload),
        remarks: state.remarks.filter((r) => r.memberId !== action.payload),
      };
    case "SET_REMARKS":
      return { ...state, remarks: action.payload };
    case "ADD_REMARK":
      return { ...state, remarks: [...state.remarks, action.payload] };
    case "DELETE_REMARK":
      return {
        ...state,
        remarks: state.remarks.filter((r) => r.id !== action.payload),
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const handleGetMember = async () => {
    try {
      const resp = await axiosInstance.get(`/members`);
      if (resp.status === 200) {
        
        const savedMembers = resp?.data?.data;

        if (savedMembers) {
          // const members = JSON.parse(savedMembers).map((m: any) => ({
          //   ...m,
          //   createdAt: new Date(m.createdAt),
          // }));

           console.log("res",savedMembers);
          dispatch({ type: "SET_MEMBERS", payload: savedMembers });
        }
      }
    } catch (error: any) {
      console.error(error);
    }
  };
  const handleGetRemarks = async () => {
    try {
      const resp = await axiosInstance.get(`/remarks`);
      if (resp.status === 200) {
        const savedRemarks = resp?.data?.data;

        if (savedRemarks) {
          // const remarks = JSON.parse(savedRemarks).map((r: any) => ({
          //   ...r,
          //   date: new Date(r.date),
          //   createdAt: new Date(r.createdAt),
          // }));
          dispatch({ type: "SET_REMARKS", payload: savedRemarks });
        }
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  // Load data from localStorage on mount
  useEffect(() => {
    handleGetMember();
    handleGetRemarks();
    // const savedMembers = localStorage.getItem("team-members");
    // const savedRemarks = localStorage.getItem("team-remarks");

    // if (savedMembers) {
    //   const members = JSON.parse(savedMembers).map((m: any) => ({
    //     ...m,
    //     createdAt: new Date(m.createdAt),
    //   }));
    //   dispatch({ type: "SET_MEMBERS", payload: members });
    // }

    // if (savedRemarks) {
    //   const remarks = JSON.parse(savedRemarks).map((r: any) => ({
    //     ...r,
    //     date: new Date(r.date),
    //     createdAt: new Date(r.createdAt),
    //   }));
    //   dispatch({ type: "SET_REMARKS", payload: remarks });
    // }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("team-members", JSON.stringify(state.members));
  }, [state.members]);

  useEffect(() => {
    localStorage.setItem("team-remarks", JSON.stringify(state.remarks));
  }, [state.remarks]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
