import { useNavigate } from "@tanstack/react-router";
import { PagePlus } from "iconoir-react";

import { useNoteStore } from "~/stores/notes";

import List from "./components/list";

const NotebookList = () => {
  const addNotebook = useNoteStore((state) => state.addNotebook);
  const navigate = useNavigate();

  return (
    <section className="h-full w-full bg-neutral-800 text-white">
      <header className="flex items-center justify-between py-2 pr-2 pl-4">
        <h1 className="text-sm text-neutral-200">Notebooks</h1>
        <button
          className="flex cursor-pointer items-center justify-end rounded-sm p-1.5 text-neutral-300 hover:bg-neutral-700 hover:text-white"
          onClick={() => {
            const notebook = addNotebook();
            navigate({
              params: { notebookId: notebook.id },
              to: "/notebooks/$notebookId",
            });
          }}
        >
          <PagePlus className="h-4 w-4" />
        </button>
      </header>
      <div className="p-4">
        <List />
      </div>
    </section>
  );
};

export default NotebookList;
