import type { Entity } from "./shared";

export type NotebookPrimitive = Entity<{
  title: string;
  updatedAt: Date;
}>;

export type NotePrimitive = Entity<{
  content: string[];
  title: string;
}>;
