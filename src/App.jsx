import './App.css';
import TodoList from '../src/features/TodoList/TodoList.jsx';
import TodoForm from './features/TodoForm.jsx';
import { useState } from 'react';

function App() {

	const [ todoList, setTodoList] = useState([])

	function addTodo(title) {
		const newTodo = {
		id: Date.now(),
		title: title,
		isCompleted: false,
		}

		setTodoList([newTodo, ...todoList])
	}

	function completeTodo(id) {
		const updatedList = todoList.map(todo => {
			if (todo.id === id) {
				return { ...todo, isCompleted: true };
			} else {
				return todo;
			}
		});

		setTodoList(updatedList);
	}

  return (
    <div>
      <h1>React ToDoList</h1>
		<TodoForm onAddTodo={addTodo} />
		<TodoList todoList={todoList} onCompleteTodo={completeTodo}/>
    </div>
  )
}

export default App
