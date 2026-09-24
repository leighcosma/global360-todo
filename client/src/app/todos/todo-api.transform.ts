import { Todo } from './models/todo';
import { TodoResponse } from './models/todo-response';

export function processTodoResponse(response: TodoResponse): Todo {
  return { ...response, createdAt: new Date(response.createdAt) };
}
