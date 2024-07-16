import { create } from "zustand";
import { createSelectors } from "./create-selectors";

type TempState = {
  leaveData: any;
  setLeaveData: (leaveData: any) => void;
  propertData: any;
  setPropertData: (propertData: any) => void;
};

const useTempStoreBase = create<TempState>()((set) => ({
  leaveData: {},
  setLeaveData: (leaveData: any) => set({ leaveData }),
  propertData: [],
  setPropertData: (propertData: any) => set({ propertData }),
}));

export const useTempStore = createSelectors(useTempStoreBase);
