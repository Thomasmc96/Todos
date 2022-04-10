import React, { useState } from "react";
import axios from "axios";

const AddNewList = (props) => {
  const [listName, setListName] = useState("");

  // Function that adds a new list to the users list
  const pushNewList = (event) => {
    event.preventDefault();

    // API call
    axios
      .post("http://localhost:8000/server/lists/create.php", {
        name: listName,
        users_id: localStorage.getItem("users_id"),
      })
      .then(function (response) {
        console.log(response);
        // If response if good
        if (response.status === 200) {
          props.setLists([
            ...props.lists,
            { lists_id: response.data.lists_id, name: listName },
          ]);
        } else {
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    props.showNewList();
  };

  // Handles users input when typing list name
  const handleListName = (event) => {
    setListName(event.target.value);
  };

  return (
    <div className="addNewListBox">
      <h2>Opret liste</h2>
      <form onSubmit={pushNewList}>
        <input
          type="text"
          name="name"
          className="inputBox"
          placeholder="Skriv her"
          required
          autoComplete="off"
          value={listName}
          onChange={handleListName}
        />
        <div>
          <button type="button" onClick={props.showNewList}>
            Tilbage
          </button>
          <button type="submit">Opret</button>
        </div>
      </form>
    </div>
  );
};
export default AddNewList;
