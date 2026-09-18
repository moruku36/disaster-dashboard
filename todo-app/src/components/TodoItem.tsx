import type { Todo } from "../types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm group">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-4 h-4 accent-blue-500 cursor-pointer"
      />
      <span
        className={`flex-1 text-sm ${
          todo.completed ? "line-through text-gray-400" : "text-gray-700"
        }`}
      >
        {todo.text}
      </span>
      <span className="text-xs text-gray-400 hidden group-hover:inline">
        {new Date(todo.createdAt).toLocaleDateString()}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity text-sm"
        aria-label="Delete todo"
      >
        ✕
      </button>
    </li>
  );
}
