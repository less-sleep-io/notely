import { type StateCreator } from "zustand";

import type { Notebook, NotebookPrimitive } from "../shared.types";
import type { NoteSlice } from "./noteSlice";

export interface NotebookSlice {
  addNotebook: () => NotebookPrimitive;
  deleteNotebook: (id: string) => void;
  getNotebook: (id: string) => Notebook;
  getNotebooks: () => Notebook[];
  notebooks: {
    allIds: string[];
    byId: {
      [id: string]: NotebookPrimitive;
    };
  };
  notebooksNotes: {
    notebookId: string;
    noteId: string;
  }[];
  renameNotebook: (id: string, name: string) => NotebookPrimitive;
}

export const createNotebookSlice: StateCreator<
  NotebookSlice & NoteSlice,
  [],
  [],
  NotebookSlice
> = (set, get) => ({
  addNotebook: () => {
    const state = get();
    const id = crypto.randomUUID();
    const notebook: NotebookPrimitive = {
      createdAt: new Date(),
      id,
      title: `Notebook ${state.notebooks.allIds.length + 1}`,
      updatedAt: new Date(),
    };

    set((state) => ({
      notebooks: {
        allIds: [...state.notebooks.allIds, id],
        byId: {
          ...state.notebooks.byId,
          [id]: notebook,
        },
      },
    }));

    return notebook;
  },
  deleteNotebook: (id: string) => {
    const state = get();
    const notebooks = state.notebooks;
    if (!notebooks.byId[id]) {
      throw new Error(`Notebook with id ${id} not found`);
    }
    const nextNotebooks = {
      allIds: notebooks.allIds.filter((value) => value !== id),
      byId: { ...notebooks.byId },
    };
    delete nextNotebooks.byId[id];
    set({ notebooks: nextNotebooks });
  },
  getNotebook: (id: string) => {
    const state = get();
    const notebook = state.notebooks.byId[id];
    if (!notebook) {
      throw new Error(`Notebook with id ${id} not found`);
    }
    return {
      ...notebook,
      notes: state.notebooksNotes
        .filter((nn) => nn.notebookId === id)
        .map((nn) => state.getNote({ id: nn.noteId })),
    };
  },
  getNotebooks: () => {
    const state = get();
    return state.notebooks.allIds.map((id) => state.getNotebook(id));
  },
  notebooks: {
    allIds: [],
    byId: {},
  },
  notebooksNotes: [],
  renameNotebook: (id: string, name: string) => {
    const state = get();
    const notebooks = state.notebooks;
    const notebook = notebooks.byId[id];
    if (!notebook) {
      throw new Error(`Notebook with id ${id} not found`);
    }
    const updatedNotebook: NotebookPrimitive = {
      ...notebook,
      title: name,
      updatedAt: new Date(),
    };
    set({
      notebooks: {
        ...notebooks,
        byId: {
          ...notebooks.byId,
          [id]: updatedNotebook,
        },
      },
    });
    return updatedNotebook;
  },
});
