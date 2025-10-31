type BaseEntity = {
  createdAt: Date;
  id: string;
  updatedAt: Date;
};

export type Entity<T> = {
  [K in keyof T]: T[K];
} & BaseEntity;
