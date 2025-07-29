import Editor from "./features/editor";
import NotesList from "./features/notesList";

function App() {
  return (
    <div className="flex min-h-screen w-full bg-neutral-900 text-white">
      <nav className="w-64 border-r border-neutral-800 bg-neutral-800 text-white">
        <NotesList />
      </nav>
      <main className="grow p-4">
        <Editor />
      </main>
    </div>
  );
}

export default App;
