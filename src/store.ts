import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface Note {
  content: string;
  createdAt: Date;
  id: string;
  title: string;
  updatedAt: Date;
}

export type NoteUpdate = Pick<Note, "id" | "title" | "content">;

type NoteStore = {
  notes: Note[];
  addNote: () => Note;
  updateNote: (note: NoteUpdate) => Note;
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      notes: [],
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
