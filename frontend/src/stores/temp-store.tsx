import { create } from "zustand";
import { createSelectors } from "./create-selectors";

type TempState = {
  leaveData: any;
  setLeaveData: (leaveData: any) => void;
};

const useTempStoreBase = create<TempState>()((set) => ({
  leaveData: {},
  setLeaveData: (leaveData: any) => set({ leaveData }),
}));

export const useTempStore = createSelectors(useTempStoreBase);
