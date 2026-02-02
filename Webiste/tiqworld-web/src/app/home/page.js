"use client";

import { useEffect, useState } from "react";

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await fetch("http://localhost:5000/todos");
    const data = await res.json();
    setTodos(data);
  };

  const addTodo = async () => {
    if (!task.trim()) return;

    const res = await fetch("http://localhost:5000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: task }),
    });

    const newTodo = await res.json();
    setTodos([newTodo, ...todos]);
    setTask("");
  };

  const toggleTodo = async (id) => {
    const res = await fetch(`http://localhost:5000/todos/${id}`, {
      method: "PUT",
    });

    const updated = await res.json();
    setTodos(todos.map(t => (t.id === id ? updated : t)));
  };
  const deleteTodo = async (id) => {
    await fetch(`http://localhost:5000/todos/${id}`, {
      method: "DELETE",
    });

    setTodos(todos.filter(t => t.id !== id));
  };

  const completed = todos.filter(t => t.done).length;
  const progress = todos.length
    ? Math.round((completed / todos.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10 text-black">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6">

        <h1 className="text-2xl font-semibold mb-1">
          Course Tasks
        </h1>
        <p className="text-sm text-gray-500 mb-4">
          Track your learning progress
        </p>
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Add a new lesson or task"
            className="flex-1 border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />
          <button
            onClick={addTodo}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        <ul className="space-y-3">
          {todos.length === 0 && (
            <p className="text-center text-gray-400 py-8">
              No tasks added yet
            </p>
          )}

          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between border rounded-lg px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleTodo(todo.id)}
                  className="w-4 h-4 accent-blue-600"
                />
                <span
                  className={`${
                    todo.done
                      ? "line-through text-gray-400"
                      : "text-gray-800"
                  }`}
                >
                  {todo.text}
                </span>
              </div>

              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-sm text-gray-400 hover:text-red-500"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}
