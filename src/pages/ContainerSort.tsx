import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RiEdit2Fill } from 'react-icons/ri';
import { RiDeleteBin2Fill } from 'react-icons/ri';
import ButtonGroup from 'react-bootstrap/ButtonGroup';





type TodoType = {
  id: string;
  title: string;
  column: ColumnType;
  sortIndex: number;
};

const columns = {
  incomplete: "Incomplete",
  progress: "In progress",
  completed: "Completed",
  onhold: "Cancelled",
};

type Column = typeof columns;
type ColumnType = keyof Column;

const sampleTodos: TodoType[] = [
  {
    id: uuidv4(),
    title: "hello",
    column: "incomplete",
    sortIndex: 1,
  },
  {
    id: uuidv4(),
    title: "Demo",
    column: "incomplete",
    sortIndex: 2,
  },
];

function ContainerSort() {
  const [todoTitle, setTodoTitle] = useState("");
  const [todos, setTodos] = useState<TodoType[]>(sampleTodos);
  const [editTodoId, setEditTodoId] = useState("");

  const columnMap = Object.keys(columns) as Array<ColumnType>;

  const draggedTodoItem = React.useRef<any>(null);

  const handleAddTodo = () => {
    const todoPayload: TodoType = {
      id: uuidv4(),
      title: todoTitle,
      column: "incomplete",
      sortIndex: todos[todos.length + 1]?.sortIndex || todos.length + 1,
    };
    setTodos([...todos, todoPayload]);
    setTodoTitle(""); // Clear the input field after adding a todo
  };

  const handleColumnDrop = (column: ColumnType) => {
    const index = todos.findIndex((todo) => todo.id === draggedTodoItem.current);
    const tempTodos = [...todos];
    tempTodos[index].column = column;
    setTodos(tempTodos);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(e.target.value);
  };

  const handleDeleteTodo = (todoId: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== todoId);
    setTodos(updatedTodos);
  };

  const handleEditTodo = (todoId: string, newTitle: string) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        return { ...todo, title: newTitle };
      }
      return todo;
    });
    setTodos(updatedTodos);
    setEditTodoId("");
  };

  return (
    <div className="container-sort">
      <div className="container-sort__wrapper">
        {columnMap.map((column) => (
          <div className="container-sort__column" key={column}>
            <div
              className="container-sort__items"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleColumnDrop(column)}
            >

              <h5 className="Titletext">{columns[column]}</h5>
              {todos
                .filter((todo) => todo.column === column)
                .map((todo) => (
                  <div
                    key={todo.id}
                    className="list-item"
                    draggable
                    onDragStart={(e) => (draggedTodoItem.current = todo.id)}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {editTodoId === todo.id ? (
                      <input
                        type="text"
                        value={todo.title}
                        onChange={(e) =>
                          handleEditTodo(todo.id, e.target.value)
                        }
                      />
                    ) : (
                      
                      <p className="text-center ms-5 pt-2">{todo.title}</p>
                      
                    
                    )}
                    <div className="action-buttons ms-5 ps-5 d-flex" id="parentIcons">
                      <p className="edit"  onClick={() => setEditTodoId(todo.id)}>
                        {editTodoId === todo.id ? "Save" : <RiEdit2Fill />}
                      </p>
                     
                      <p className="delete" onClick={() => handleDeleteTodo(todo.id)}>
                      
                      <RiDeleteBin2Fill />
                      </p>
                      
                    </div>

                    
                  </div>
                  
                ))}
                <Button
            variant="outline-dark " size="sm"
              className="add-button text-secondary " id="btntest"
              onClick={() => {
                const newTitle = prompt("Enter a title:");
                if (newTitle) {
                  const todoPayload: TodoType = {
                    id: uuidv4(),
                    title: newTitle,
                    column: column,
                    sortIndex: todos.length + 1,
                  };
                  setTodos([...todos, todoPayload]);
                }
              }}
            >
             + Add Task
            </Button>
            </div>
          </div>
        ))}
      </div>
     
    </div>
  );
}

export default ContainerSort;
