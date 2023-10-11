import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import environment from "../../environment";
import { TailSpin } from "react-loader-spinner";
import cross from "../../assets/img/icons_v2/cross.svg";

const Members = (props) => {
  const params = useParams();
  const lists_id = params.id;

  const [listMembers, setListMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState();

  const hidePopup = useCallback(
    (event) => {
      const box = document.querySelector(".popup");

      if (!event.target.classList.contains("cross"))
        if (!box.contains(event.target)) {
          props.showMembers(false);
        }
    },
    [props]
  );

  useEffect(() => {
    setLoading(true);
    axios(
      `${environment[0]}/server/Lists/SharedLists/Members.php?lists_id=${lists_id}`
    )
      .then((response) => {
        if (response.data.code === 200) {
          setListMembers(response.data.members);
        }
        setLoading(false);
        setStatusCode(response.data.code);
      })
      .catch((error) => {
        setLoading(false);
        setStatusCode(500);
      });

    window.addEventListener("click", hidePopup);

    return () => {
      window.removeEventListener("click", hidePopup);
    };
  }, [lists_id, hidePopup]);

  return (
    <div className="members popup">
      <img
        src={cross}
        alt="lukned-knap"
        className="cross"
        onClick={props.showMembers}
      />
      <h2>Medlemmer</h2>
      {loading ? (
        <TailSpin color="#000000" height={40} width={40} />
      ) : (
        statusCode === 200 &&
        Array.isArray(listMembers) &&
        listMembers.length > 0 &&
        listMembers
          .sort((a, b) => b.owner - a.owner)
          .map((member, i) => {
            const { name, owner } = member;
            return (
              <div key={i} className="member">
                <p>
                  {name} {owner === 1 && <span>(ejer)</span>}
                </p>
              </div>
            );
          })
      )}
      {!loading && statusCode === 500 && <p>Der skete desværre en fejl...</p>}
    </div>
  );
};

export default Members;
