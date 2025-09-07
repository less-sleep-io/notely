import { type StateCreator } from "zustand";

export interface RootStore {
  selectedNoteId: string | null;
  setSelectedNoteId: (id: string | null) => void;
}

export const createRootSlice: StateCreator<RootStore, [], [], RootStore> = (
  set,
) => ({
  selectedNoteId: null,
  setSelectedNoteId: (id: string | null) => set({ selectedNoteId: id }),
});
