import { createFileRoute } from "@tanstack/react-router";

const Index = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <p className="text-xl text-neutral-300">Select a note.</p>
    </div>
  );
};

export const Route = createFileRoute("/")({
  component: Index,
});
