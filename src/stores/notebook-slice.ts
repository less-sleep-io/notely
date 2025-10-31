import { type StateCreator } from "zustand";

import type { NotebookPrimitive } from "~/types/api";

import type { Notebook } from "../types/app";
import type { NoteSlice } from "./note-slice";

interface AddNoteToNotebookArgs {
  notebookId: string;
  noteId: string;
}

interface DeleteNotebookArgs {
  id: string;
}

interface RenameNotebookArgs {
  id: string;
  name: string;
}

interface GetNotebookArgs {
  id: string;
}

export interface NotebookSlice {
  addNotebook: () => NotebookPrimitive;
  addNoteToNotebook: (args: AddNoteToNotebookArgs) => void;
  deleteNotebook: (args: DeleteNotebookArgs) => void;
  getNotebook: (args: GetNotebookArgs) => Notebook;
  getNotebooks: () => Notebook[];
  notebooks: {
    entities: {
      [id: string]: NotebookPrimitive;
    };
    ids: string[];
  };
  notebooksNotes: {
    notebookId: string;
    noteId: string;
  }[];
  renameNotebook: (args: RenameNotebookArgs) => NotebookPrimitive;
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
      title: `Notebook ${state.notebooks.ids.length + 1}`,
      updatedAt: new Date(),
    };

    set((state) => ({
      notebooks: {
        entities: {
          ...state.notebooks.entities,
          [id]: notebook,
        },
        ids: [...state.notebooks.ids, id],
      },
    }));

    return notebook;
  },
  addNoteToNotebook: ({ notebookId, noteId }: AddNoteToNotebookArgs) => {
    const state = get();

    set({
      notebooksNotes: [...state.notebooksNotes, { notebookId, noteId }],
    });
  },
  deleteNotebook: ({ id }: DeleteNotebookArgs) => {
    const state = get();
    const notebooks = state.notebooks;
    if (!notebooks.entities[id]) {
      throw new Error(`Notebook with id ${id} not found`);
    }
    const nextNotebooks = {
      entities: { ...notebooks.entities },
      ids: notebooks.ids.filter((value) => value !== id),
    };
    delete nextNotebooks.entities[id];
    set({ notebooks: nextNotebooks });
  },
  getNotebook: ({ id }: GetNotebookArgs) => {
    const state = get();
    const notebook = state.notebooks.entities[id];
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
    return state.notebooks.ids.map((id) => state.getNotebook({ id }));
  },
  notebooks: {
    entities: {},
    ids: [],
  },
  notebooksNotes: [],
  renameNotebook: ({ id, name }: RenameNotebookArgs) => {
    const state = get();
    const notebooks = state.notebooks;
    const notebook = notebooks.entities[id];
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
        entities: {
          ...notebooks.entities,
          [id]: updatedNotebook,
        },
      },
    });
    return updatedNotebook;
  },
});
