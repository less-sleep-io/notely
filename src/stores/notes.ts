import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  type ContentBlockSlice,
  createContentBlockSlice,
} from "./content-block-slice";
import { type NoteSlice, createNoteSlice } from "./note-slice";
import { type NotebookSlice, createNotebookSlice } from "./notebook-slice";
import { type RootStore, createRootSlice } from "./root-slice";

export const useNoteStore = create<
  RootStore & NoteSlice & NotebookSlice & ContentBlockSlice
>()(
  persist(
    (...args) => ({
      ...createRootSlice(...args),
      ...createNoteSlice(...args),
      ...createNotebookSlice(...args),
      ...createContentBlockSlice(...args),
    }),
    {
      name: "notely",
      partialize: (state) => ({
        contentBlocks: state.contentBlocks,
        notebooks: state.notebooks,
        notes: state.notes,
      }),
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
