import React, { useState } from "react";
import axios from "axios";
import environment from "../../environment";
import { TailSpin } from "react-loader-spinner";
import { useParams } from "react-router-dom";

const DeleteList = (props) => {
  // Params from URL
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const deleteList = (event) => {
    event.preventDefault();
    setLoading(true);
    // API call
    axios
      .post(`${environment[0]}/server/Lists/Delete.php`, {
        lists_id: id,
      })
      .then(function (response) {
        setLoading(false);

        // If response if good
        if (response.data.code === 200) {
          window.location.replace("/");
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

  return (
    <div className="deleteList popup">
      <span className="cross" onClick={props.showDeleteList}>x</span>
      <h2>Vil du slette listen?</h2>
      <p>Listen vil blive slettet permanent.</p>
      <form onSubmit={deleteList}>
        {loading ? (
          <div className="loading">
            <TailSpin color="#000000" height={40} width={40} />
          </div>
        ) : (
          <div>
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
