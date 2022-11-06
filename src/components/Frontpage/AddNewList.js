import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import environment from "../../environment";
import { TailSpin } from "react-loader-spinner";

const AddNewList = (props) => {
  const [listName, setListName] = useState("");
  const [loading, setLoading] = useState(false);

  const hidePopup = useCallback(
    (event) => {
      const box = document.querySelector(".popup");

      if (
        event.target.id !== "addListBtn" &&
        !event.target.classList.contains("cross")
      )
        if (!box.contains(event.target)) {
          props.showNewList(false);
        }
    },
    [props]
  );

  useEffect(() => {
    window.addEventListener("click", hidePopup);

    return () => {
      window.removeEventListener("click", hidePopup);
    };
  }, [hidePopup]);

  // Function that adds a new list to the users list
  const pushNewList = (event) => {
    event.preventDefault();
    setLoading(true);
    // API call
    axios
      .post(`${environment[0]}/server/Lists/Create.php`, {
        name: listName,
        users_id: localStorage.getItem("users_id"),
      })
      .then(function (response) {
        setLoading(false);

        // If response if good
        if (response.status === 200) {
          props.setLists([
            ...props.lists,
            { lists_id: response.data.lists_id, name: listName },
          ]);

          props.showNewList();
        }
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  // Handles users input when typing list name
  const handleListName = (event) => {
    setListName(event.target.value);
  };

  return (
    <div className="addNewListBox popup">
      <span className="cross" onClick={props.showNewList}>
        x
      </span>
      <h2>Opret liste</h2>
      <form onSubmit={pushNewList}>
        <input
          autoFocus
          type="text"
          name="name"
          className="inputBox"
          placeholder="Skriv her"
          required
          autoComplete="off"
          value={listName}
          onChange={handleListName}
        />
        {loading ? (
          <div className="loading">
            <TailSpin color="#000000" height={40} width={40} />
          </div>
        ) : (
          <div>
            <button type="submit">Opret</button>
          </div>
        )}
      </form>
    </div>
  );
};
export default AddNewList;
