import React, { useState } from "react";
import axios from "axios";
import environment from "../../environment";
import { TailSpin } from "react-loader-spinner";

const DeleteList = (props) => {
  const [listName, setListName] = useState("");
  const [loading, setLoading] = useState(false);

  const deleteList = (event) => {
    event.preventDefault();
    setLoading(true);
    // API call
    axios
      .post(`${environment[0]}/server/Lists/Delete.php`, {
        lists_id: props.lists_id,
      })
      .then(function (response) {
        setLoading(false);

        // If response if good
        if (response.data.code === 200) {
          props.setLists((prevLists) => {
            return prevLists.filter((list) => list.lists_id != props.lists_id);
          });
          props.showDeleteList();
        } else {
          // Show error message
          console.log("error");
        }
      })
      .catch(function (error) {
        // Another error message
        console.log(error);
        setLoading(false);
      });
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
        {loading ? (
          <div className="loading">
            <TailSpin color="#000000" height={40} width={40} />
          </div>
        ) : (
          <div>
            <button type="button" onClick={props.showDeleteList}>
              Tilbage
            </button>
            <button id="deleteBtn" type="submit" onClick={deleteList}>
              Slet liste
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
export default DeleteList;
