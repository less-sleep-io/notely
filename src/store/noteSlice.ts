import { type StateCreator } from "zustand";

import type { Note, NotePrimitive, TextBlockTag } from "../shared.types";
import type { ContentBlockSlice } from "./contentBlockSlice";
import type { RootStore } from "./rootSlice";

export type NoteUpdate = Pick<Note, "id" | "title" | "content">;
export type NoteDelete = Pick<Note, "id">;

export interface AddContentBlockArgs {
  index: number;
  noteId: string;
  tag: TextBlockTag;
  type: "text";
}

export interface RemoveContentBlockArgs {
  blockId: string;
  noteId: string;
}

export interface NoteSlice {
  addNote: () => NotePrimitive;
  addNoteContentBlock: (args: AddContentBlockArgs) => void;
  deleteNote: (args: NoteDelete) => void;
  getNote: (args: { id: string }) => Note;
  getNotes: () => Note[];
  notes: {
    allIds: string[];
    byId: {
      [id: string]: NotePrimitive;
    };
  };
  removeNoteContentBlock: (args: RemoveContentBlockArgs) => void;
  updateNote: (note: NoteUpdate) => void;
}

export const createNoteSlice: StateCreator<
  NoteSlice & RootStore & ContentBlockSlice,
  [],
  [],
  NoteSlice
> = (set, get) => ({
  addNote: () => {
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
      title: `Note ${state.notes.allIds.length + 1}`,
      updatedAt: new Date(),
    };

    // Add the new note to the store
    set({
      notes: {
        allIds: [...notes.allIds, newNote.id],
        byId: {
          ...notes.byId,
          [newNote.id]: newNote,
        },
      },
    });

    return newNote;
  },
  addNoteContentBlock: ({ index, noteId, tag }) => {
    const state = get();
    const notes = state.notes;
    const note = notes.byId[noteId];
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
        byId: {
          ...notes.byId,
          [updatedNote.id]: updatedNote,
        },
      },
    });
  },
  deleteNote: ({ id }: NoteDelete) => {
    const state = get();
    const notes = state.notes;
    const noteToDelete = notes.byId[id];
    const selectedNoteId = state.selectedNoteId;
    if (!noteToDelete) {
      throw new Error(`Note with id ${id} not found`);
    }
    const nextNotes = {
      allIds: notes.allIds.filter((value) => value !== id),
      byId: { ...notes.byId },
    };
    delete nextNotes.byId[id];

    get().setSelectedNoteId(selectedNoteId === id ? null : selectedNoteId);

    // Add the new note to the store
    set({
      notes: nextNotes,
    });

    return noteToDelete;
  },
  getNote: ({ id }: { id: string }) => {
    const state = get();
    const note = state.notes.byId[id];
    const contentBlocks = state.contentBlocks;

    if (!note) {
      throw new Error("Could not find note");
    }

    return {
      ...note,
      content: note.content.map((blockId) => {
        return contentBlocks.byId[blockId];
      }),
    };
  },
  getNotes: () => {
    const state = get();
    const notes = state.notes;
    return notes.allIds.map((id) => state.getNote({ id }));
  },
  notes: {
    allIds: [],
    byId: {},
  },
  removeNoteContentBlock: ({ blockId, noteId }: RemoveContentBlockArgs) => {
    const state = get();
    const notes = state.notes;
    const note = notes.byId[noteId];
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
        byId: {
          ...notes.byId,
          [updatedNote.id]: updatedNote,
        },
      },
    });
  },
  updateNote: ({ id, title }: NoteUpdate) => {
    const state = get();
    const notes = state.notes;
    const note = notes.byId[id];
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
        byId: {
          ...notes.byId,
          [updatedNote.id]: updatedNote,
        },
      },
    });

    return updatedNote;
  },
});
