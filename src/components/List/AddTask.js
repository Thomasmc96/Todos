import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import environment from "../../environment";
import { TailSpin } from "react-loader-spinner";

const AddTask = (props) => {
  const { id } = useParams();

  const [taskName, setTaskName] = useState("");
  const [loading, setLoading] = useState(false);

  // Function that adds a new task to the users list
  const pushTask = (event) => {
    event.preventDefault();
    setLoading(true);
    axios
      .post(`${environment[0]}/server/Products/Create.php`, {
        name: taskName,
        lists_id: id,
      })
      .then(function (response) {
        setLoading(false);
        // If response is good
        if (response.status === 200) {
          props.setList({
            list_name: props.list.list_name,
            users_id: props.list.users_id,
            products: [
              ...props.list.products,
              {
                completed: "0",
                products_id: response.data.products_id,
                name: taskName,
              },
            ],
          });

          setTaskName("");
          document.getElementById("taskNameBox").focus();
          document.getElementById("addTaskHeader").innerHTML =
            "Tilføj en opgave mere";
        } else {
        }
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  // Handles users input when typing task name
  const handleTaskName = (event) => {
    setTaskName(event.target.value);
  };

  return (
    <div className="addTask">
      <h2 id="addTaskHeader">Tilføj en opgave</h2>
      <form onSubmit={pushTask}>
        <input
          id="taskNameBox"
          autoFocus
          type="text"
          name="name"
          className="inputBox"
          placeholder="Skriv her"
          required
          autoComplete="off"
          value={taskName}
          onChange={handleTaskName}
        />
        {loading ? (
          <div className="loading">
            <TailSpin color="#000000" height={40} width={40} />
          </div>
        ) : (
          <div>
            <button type="button" onClick={props.showAddTask}>
              Tilbage
            </button>
            <button type="submit">Tilføj</button>
          </div>
        )}
      </form>
    </div>
  );
};
export default AddTask;
