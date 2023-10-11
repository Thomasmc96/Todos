import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import environment from "../../environment";
import { TailSpin } from "react-loader-spinner";
import { useParams } from "react-router-dom";
import cross from "../../assets/img/icons_v2/cross.svg";

const DeleteList = (props) => {
  // Params from URL
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const hidePopup = useCallback(
    (event) => {
      const box = document.querySelector(".popup");

      if (!event.target.classList.contains("cross"))
        if (!box.contains(event.target)) {
          props.showDeleteList(false);
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
      <img
        src={cross}
        alt="lukned-knap"
        className="cross"
        onClick={props.showDeleteList}
      />
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
