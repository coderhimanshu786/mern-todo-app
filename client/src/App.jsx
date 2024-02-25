import React, { useEffect, useState } from "react";
import Todo from "./todo";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState([]);

  useEffect(() => {
    async function getTodos() {
      let res = await fetch("/api/todos");
      let todos = await res.json();

      setTodos(todos);
    }
    getTodos();
  }, []);

  async function createNewTodo(e) {
    e.preventDefault();
    if (content.length > 2) {
      const res = await fetch("/api/todos", {
        method: "POST",
        body: JSON.stringify({ todo: content }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newTodo = await res.json();
      setContent("");
      setTodos([...todos, newTodo]);
    }
  }

  return (
    <main className="container">
      <h1 className="title"> Awesome Todo's </h1>
      <form className="form" onSubmit={createNewTodo}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter a new todo..."
          className="form__input"
          required
        />
        <button type="submit"> Create Todo </button>
      </form>
      <div className="todos">
        {todos.length > 0 &&
          todos.map((todo) => (
            <Todo key={todo._id} todo={todo} setTodos={setTodos} />
          ))}
      </div>
    </main>
  );
}
