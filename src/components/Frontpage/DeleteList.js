import React, { useState } from "react";
import axios from "axios";

const DeleteList = (props) => {
  const [listName, setListName] = useState("");

  const deleteList = (event) => {
    event.preventDefault();

    // API call
    axios
      .post("http://localhost:8000/server/lists/delete.php", {
        lists_id: props.lists_id,
      })
      .then(function (response) {
        // If response if good
        if (response.data.code === 200) {
          props.setLists((prevLists) => {
            return prevLists.filter((list) => list.lists_id != props.lists_id);
          });
        } else {
          // Show error message
          console.log("error");
        }
      })
      .catch(function (error) {
        // Another error message
        console.log(error);
      });

    props.showDeleteList();
  };

  const handleListName = (event) => {
    setListName(event.target.value);
  };

  return (
    <div className="deleteList">
      <h2>
        Listen vil blive slettet permanent. <br /> Vil du slette listen?
      </h2>
      <form onSubmit={deleteList}>
        <div>
          <button type="button" onClick={props.showDeleteList}>
            Tilbage
          </button>
          <button id="deleteBtn" type="submit" onClick={deleteList}>
            Slet liste
          </button>
        </div>
      </form>
    </div>
  );
};
export default DeleteList;
