import { create } from "zustand";

export type CartItem = {
  name: string;
  description: string;
  total: number;
  payment: string;
};

export interface ZustandProps {
  data: CartItem[];
  updateData: (newData: CartItem[]) => void;
  resetData: () => void;
}

export const useCartStore = create<ZustandProps>((set) => ({
  data: [],
  updateData: (newData: CartItem[]) => {
    set({ data: newData });
  },
  resetData: () => set({ data: [] }),
}));
