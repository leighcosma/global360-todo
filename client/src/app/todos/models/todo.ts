export type Todo = Readonly<{
  id: string;
  title: string;
  createdAt: Date;
}>;

export const titleMaxLength = 200;
