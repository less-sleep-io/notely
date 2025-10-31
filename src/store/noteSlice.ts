import { type StateCreator } from "zustand";

import type { NotePrimitive } from "~/types/api";
import type { Note, TextBlockTag } from "~/types/app";

import type { ContentBlockSlice } from "./contentBlockSlice";
import type { NotebookSlice } from "./notebookSlice";
import type { RootStore } from "./rootSlice";

export type NoteUpdate = Pick<Note, "id" | "title" | "content">;
export type NoteDelete = Pick<Note, "id">;

export interface AddNoteArgs {
  notebookId: string;
}

export interface AddNoteContentBlockArgs {
  index: number;
  noteId: string;
  tag: TextBlockTag;
  type: "text";
}

export interface RemoveNoteContentBlockArgs {
  blockId: string;
  noteId: string;
}

export interface NoteSlice {
  addNote: (args: AddNoteArgs) => NotePrimitive;
  addNoteContentBlock: (args: AddNoteContentBlockArgs) => void;
  deleteNote: (args: NoteDelete) => void;
  getNote: (args: { id: string }) => Note;
  getNotes: () => Note[];
  notes: {
    entities: {
      [id: string]: NotePrimitive;
    };
    ids: string[];
  };
  removeNoteContentBlock: (args: RemoveNoteContentBlockArgs) => void;
  updateNote: (note: NoteUpdate) => void;
}

export const createNoteSlice: StateCreator<
  NotebookSlice & NoteSlice & RootStore & ContentBlockSlice,
  [],
  [],
  NoteSlice
> = (set, get) => ({
  addNote: ({ notebookId }) => {
    const state = get();
    const notes = state.notes;
    // add an initial block to store and get its id
    // to link to the new note
    const initialBlock = state.addContentBlock({
      content: "Note 1",
      tag: "h1",
      type: "text",
    });

    const newNote: NotePrimitive = {
      content: [initialBlock.id],
      createdAt: new Date(),
      id: crypto.randomUUID(),
      title: `Note ${state.notes.ids.length + 1}`,
      updatedAt: new Date(),
    };

    // Add the new note to the store
    set({
      notes: {
        entities: {
          ...notes.entities,
          [newNote.id]: newNote,
        },
        ids: [...notes.ids, newNote.id],
      },
    });

    // Link it to the notebook
    state.addNoteToNotebook({ notebookId, noteId: newNote.id });

    return newNote;
  },
  addNoteContentBlock: ({ index, noteId, tag }: AddNoteContentBlockArgs) => {
    const state = get();
    const notes = state.notes;
    const note = notes.entities[noteId];
    if (!note) {
      throw new Error(`Note with id ${noteId} not found`);
    }

    const newBlock = state.addContentBlock({ tag, type: "text" });

    const updatedNote: NotePrimitive = {
      ...note,
      content: [
        ...note.content.slice(0, index),
        newBlock.id,
        ...note.content.slice(index),
      ],
      updatedAt: new Date(),
    };

    set({
      notes: {
        ...notes,
        entities: {
          ...notes.entities,
          [updatedNote.id]: updatedNote,
        },
      },
    });
  },
  deleteNote: ({ id }: NoteDelete) => {
    const state = get();
    const notes = state.notes;
    const noteToDelete = notes.entities[id];
    const selectedNoteId = state.selectedNoteId;
    if (!noteToDelete) {
      throw new Error(`Note with id ${id} not found`);
    }
    const nextNotes = {
      entities: { ...notes.entities },
      ids: notes.ids.filter((value) => value !== id),
    };
    delete nextNotes.entities[id];

    get().setSelectedNoteId(selectedNoteId === id ? null : selectedNoteId);

    // Add the new note to the store
    set({
      notes: nextNotes,
    });

    return noteToDelete;
  },
  getNote: ({ id }: { id: string }) => {
    const state = get();
    const note = state.notes.entities[id];
    const contentBlocks = state.contentBlocks;

    if (!note) {
      throw new Error("Could not find note");
    }

    return {
      ...note,
      content: note.content.map((blockId) => {
        return contentBlocks.entities[blockId];
      }),
    };
  },
  getNotes: () => {
    const state = get();
    const notes = state.notes;
    return notes.ids.map((id) => state.getNote({ id }));
  },
  notes: {
    entities: {},
    ids: [],
  },
  removeNoteContentBlock: ({ blockId, noteId }: RemoveNoteContentBlockArgs) => {
    const state = get();
    const notes = state.notes;
    const note = notes.entities[noteId];
    if (!note) {
      throw new Error(`Note with id ${noteId} not found`);
    }
    const updatedContent = note.content.filter((id) => id !== blockId);
    const updatedNote: NotePrimitive = {
      ...note,
      content: updatedContent,
      updatedAt: new Date(),
    };

    state.removeContentBlock({ blockId });

    set({
      notes: {
        ...notes,
        entities: {
          ...notes.entities,
          [updatedNote.id]: updatedNote,
        },
      },
    });
  },
  updateNote: ({ id, title }: NoteUpdate) => {
    const state = get();
    const notes = state.notes;
    const note = notes.entities[id];
    if (!note) {
      throw new Error(`Note with id ${id} not found`);
    }
    const updatedNote: NotePrimitive = {
      ...note,
      title,
      updatedAt: new Date(),
    };

    set({
      notes: {
        ...notes,
        entities: {
          ...notes.entities,
          [updatedNote.id]: updatedNote,
        },
      },
    });

    return updatedNote;
  },
});
