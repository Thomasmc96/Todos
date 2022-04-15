import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const AddTask = (props) => {
  const { id } = useParams();

  const [taskName, setTaskName] = useState("");

  // Function that adds a new task to the users list
  const pushTask = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8000/server/products/create.php", {
        name: taskName,
        lists_id: id,
      })
      .then(function (response) {
        // If response if good
        if (response.status === 200) {
          props.setList({
            list_name: props.list.list_name,
            products: [
              ...props.list.products,
              {
                completed: "0",
                products_id: response.data.products_id,
                name: taskName,
              },
            ],
          });
        } else {
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    props.showAddTask();
  };

  // Handles users input when typing task name
  const handleTaskName = (event) => {
    setTaskName(event.target.value);
  };

  return (
    <div className="addTask">
      <h2>Tilføj en opgave</h2>
      <form onSubmit={pushTask}>
        <input
          type="text"
          name="name"
          className="inputBox"
          placeholder="Skriv her"
          required
          autoComplete="off"
          value={taskName}
          onChange={handleTaskName}
        />
        <div>
          <button type="button" onClick={props.showAddTask}>
            Tilbage
          </button>
          <button type="submit">Tilføj</button>
        </div>
      </form>
    </div>
  );
};
export default AddTask;
