import { create } from "zustand";
import { createSelectors } from "./create-selectors";

interface UserState {
  user: any;
  setUser: (data: any) => void;
}

export enum ROLE {
  SELLER = 1,
  BUYER = 2,
}

const useUserStoreBase = create<UserState>()((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
}));

export const useUserStore = createSelectors(useUserStoreBase);
