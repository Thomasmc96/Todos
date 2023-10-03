import React, { useEffect, useCallback } from "react";
import shareIcon from "../../assets/img/share.svg";
import leaveIcon from "../../assets/img/leave.svg";
import deleteIcon from "../../assets/img/delete.svg";
import membersIcon from "../../assets/img/shared-list.svg";

const Options = (props) => {
  const hidePopup = useCallback(
    (event) => {
      const box = document.querySelector(".popup");

      if (
        !event.target.classList.contains("optionsIcon") &&
        !event.target.classList.contains("cross")
      )
        if (!box.contains(event.target)) {
          props.showOptions(false);
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

  return (
    <div className="options popup">
      <span className="cross" onClick={props.showOptions}>
        x
      </span>
      <h2>Valgmuligheder</h2>
      <div>
        <button type="button" onClick={props.showMembers}>
          <p>Medlemmer</p>
        </button>
        {props.list.users_id === localStorage.getItem("users_id") && (
          <React.Fragment>
            <button type="button" onClick={props.showShareList}>
              <p>Del liste</p>
            </button>
            <button
              type="button"
              className="danger"
              onClick={props.showDeleteList}
            >
              <p>Slet liste</p>
            </button>
          </React.Fragment>
        )}
        {props.list.users_id !== localStorage.getItem("users_id") && (
          <button className="danger" onClick={props.showLeaveList}>
            <img
              className="leaveIcon icon"
              src={leaveIcon}
              alt="Forlad liste ikon"
            />
            <p>Forlad liste</p>
          </button>
        )}
      </div>
    </div>
  );
};
export default Options;
