import React, { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { RiEdit2Fill, RiDeleteBin2Fill } from "react-icons/ri";
import Form from "react-bootstrap/Form";
import { dataRef } from "../Firebases";

type TodoType = {
  id: string;
  title: string;
  column: ColumnType;
  sortIndex: number;
};

const initialColumns = {
  incomplete: "Incomplete",
  progress: "In progress",
  completed: "Completed",
  onhold: "Cancelled",
};

type Column = typeof initialColumns;
type ColumnType = keyof Column;

function ContainerSort() {
  const [todoTitle, setTodoTitle] = useState("");
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [editTodoId, setEditTodoId] = useState("");
  const [columns, setColumns] = useState<Column>(initialColumns);
  const draggedTodoItem = useRef<string | null>(null);

  const handleAddTodo = () => {
    const todoPayload: TodoType = {
      id: uuidv4(),
      title: todoTitle,
      column: "incomplete",
      sortIndex: todos.length + 1,
    };

    setTodos([...todos, todoPayload]);
    setTodoTitle("");
    dataRef.ref("user task").push(todoPayload); // Save the task to Firebase
  };

  const handleColumnDrop = (column: ColumnType) => {
    // Implementation for handling column drop
    // ...
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
  };

  useEffect(() => {
    const storedTodos = dataRef.ref("user task"); // Retrieve todos from Firebase

    storedTodos.on("value", (snapshot) => {
      const tasks = snapshot.val();
      if (tasks) {
        const taskArray: TodoType[] = Object.values(tasks);
        setTodos(taskArray);
      }
    });

    return () => {
      storedTodos.off("value"); // Unsubscribe from Firebase listener when component unmounts
    };
  }, []);

  useEffect(() => {
    const storedColumns = dataRef.ref("user columns"); // Retrieve columns from Firebase

    storedColumns.on("value", (snapshot) => {
      const columnsData = snapshot.val();
      if (columnsData) {
        setColumns(columnsData);
      }
    });

    return () => {
      storedColumns.off("value"); // Unsubscribe from Firebase listener when component unmounts
    };
  }, []);

  const handleCreateColumn = () => {
    const newColumnName = prompt("Enter the new column name");
    if (newColumnName && !columns.hasOwnProperty(newColumnName)) {
      const newColumns = {
        ...columns,
        [newColumnName]: newColumnName,
      };
      setColumns(newColumns);
      dataRef.ref("user columns").set(newColumns); // Save the columns to Firebase
    }
  };

  const handleDeleteColumn = (columnKey: ColumnType) => {
    const updatedColumns = { ...columns };
    delete updatedColumns[columnKey];
    const updatedTodos = todos.filter((todo) => todo.column !== columnKey);
    setColumns(updatedColumns);
    setTodos(updatedTodos);
    dataRef.ref("user columns").set(updatedColumns); // Save the updated columns to Firebase
  };

  return (
    <>
      <div className="container main">
        <Button
          variant="outline-dark"
          size="sm"
          className="add-column-button"
          onClick={handleCreateColumn}
        >
          Create Card
        </Button>
        <div className="container-sort">
          <div className="container-sort__wrapper me-5">
            {Object.entries(columns).map(([columnKey, columnName]) => (
              <div className="container-sort__column" key={columnKey}>
                <Button
                  variant="light"
                  size="sm"
                  className="delete-column"
                  onClick={() => handleDeleteColumn(columnKey as ColumnType)}
                >
                  <RiDeleteBin2Fill />
                </Button>
                <div
                  className="container-sort__items"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleColumnDrop(columnKey as ColumnType)}
                >
                  <h5 className="Titletext">{columnName}</h5>
                  {todos
                    .filter((todo) => todo.column === columnKey)
                    .map((todo) => (
                      <div
                        key={todo.id}
                        className="list-item"
                        draggable
                        onDragStart={(e) => (draggedTodoItem.current = todo.id)}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        {editTodoId === todo.id ? (
                          <Form.Control
                            id="editInput"
                            type="text"
                            placeholder="Small text"
                            value={todo.title}
                            onChange={(e) => handleEditTodo(todo.id, e.target.value)}
                          />
                        ) : (
                          <p className="text-center ms-5 pt-2">{todo.title}</p>
                        )}
                        <div className="action-buttons ms-5 ps-5 d-flex" id="parentIcons">
                          <p className="edit" onClick={() => setEditTodoId(todo.id)}>
                            {editTodoId === todo.id ? "Save" : <RiEdit2Fill />}
                          </p>
                          <p className="delete" onClick={() => handleDeleteTodo(todo.id)}>
                            <RiDeleteBin2Fill />
                          </p>
                        </div>
                      </div>
                    ))}
                  <div>
                    <Button
                      variant="outline-dark"
                      size="sm"
                      className="add-button text-secondary"
                      id="btntest"
                      onClick={() => {
                        const newTitle = prompt("Input your task");
                        if (newTitle) {
                          const todoPayload: TodoType = {
                            id: uuidv4(),
                            title: newTitle,
                            column: columnKey as ColumnType,
                            sortIndex: todos.length + 1,
                          };
                          setTodos([...todos, todoPayload]);
                          dataRef.ref("user task").push(todoPayload); // Save the task to Firebase
                        }
                      }}
                    >
                      + Add Task
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ContainerSort;
