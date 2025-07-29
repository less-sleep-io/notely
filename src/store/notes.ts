import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Note } from "../shared.types";

export type NoteUpdate = Pick<Note, "id" | "title" | "content">;
export type NoteDelete = Pick<Note, "id">;

type NoteStore = {
  notes: Note[];
  addNote: () => Note;
  deleteNote: (args: NoteDelete) => Note;
  selectedNote: Note | null;
  setSelectedNote: (id: string | null) => void;
  updateNote: (note: NoteUpdate) => Note;
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      notes: [],
      selectedNote: null,
      addNote: () => {
        const newNote: Note = {
          content: "",
          createdAt: new Date(),
          id: crypto.randomUUID(),
          title: `Note ${get().notes.length + 1}`,
          updatedAt: new Date(),
        };
        const currentNotes = get().notes;

        // Add the new note to the store
        set({
          notes: [...currentNotes, newNote],
        });

        return newNote;
      },
      deleteNote: ({ id }: NoteDelete) => {
        const noteToDelete = get().notes.find((note) => note.id === id);
        const selectedNote = get().selectedNote;
        if (!noteToDelete) {
          throw new Error(`Note with id ${id} not found`);
        }
        const currentNotes = get().notes;

        // Add the new note to the store
        set({
          notes: currentNotes.filter((note) => note.id !== id),
          selectedNote: selectedNote?.id === id ? null : selectedNote,
        });

        return noteToDelete;
      },
      setSelectedNote: (id: string | null) => {
        const note = get().notes.find((note) => note.id === id);
        set({ selectedNote: note || null });
      },
      updateNote: ({ content, id, title }: NoteUpdate) => {
        const note = get().notes.find((note) => note.id === id);
        if (!note) {
          throw new Error(`Note with id ${id} not found`);
        }
        const updatedNote: Note = {
          ...note,
          content,
          title,
          updatedAt: new Date(),
        };

        set({
          notes: get().notes.map((note) =>
            note.id === id ? updatedNote : note,
          ),
        });

        return updatedNote;
      },
    }),
    {
      name: "notely", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
