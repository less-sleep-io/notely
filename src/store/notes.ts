import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  type ContentBlockSlice,
  createContentBlockSlice,
} from "./contentBlockSlice";
import { type NoteSlice, createNoteSlice } from "./noteSlice";
import { type NotebookSlice, createNotebookSlice } from "./notebookSlice";
import { type RootStore, createRootSlice } from "./rootSlice";

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
