import React, { useState } from "react";
import axios from "axios";

const EditTask = (props) => {
  const [taskName, setTaskName] = useState(props.task.name);

  const edit = (event) => {
    event.preventDefault();

    // Return and hide popup if no changes were made
    if (props.task.name === taskName) {
      props.showEditTask();
      return;
    }

    axios
      .post("http://localhost:8000/server/products/update.php", {
        products_id: props.task.products_id,
        name: taskName,
      })
      .then(function (response) {
        // If response if good
        if (response.data.code === 200) {
          // Toggle popup
          props.showEditTask();

          // Save state array in local variable
          let products = [...props.list.products];

          // Save the one product we are handling
          let product = products[props.index];

          // Set value for property
          product.name = taskName;

          // Save product in local array
          products[props.index] = product;

          props.setList({
            list_name: props.list.list_name,
            users_id: props.list.users_id,
            products: products,
          });
        } else {
          console.log("Error");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleEditTask = (event) => {
    setTaskName(event.target.value);
  };

  return (
    <div className="addTask">
      <h2>Skift navn på punktet</h2>
      <input
        type="text"
        name="name"
        className="inputBox"
        required
        autoComplete="off"
        value={taskName}
        onChange={handleEditTask}
      />
      <div>
        <button type="button" onClick={props.showEditTask}>
          Tilbage
        </button>
        <button type="submit" onClick={edit}>
          Gem
        </button>
      </div>
    </div>
  );
};
export default EditTask;
