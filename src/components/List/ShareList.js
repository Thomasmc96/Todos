import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import environment from "../../environment";
import { TailSpin } from "react-loader-spinner";

const ShareList = (props) => {
  const params = useParams();
  const lists_id = params.id;

  const [mail, setMail] = useState("");
  const [loading, setLoading] = useState(false);

  const share = (event) => {
    event.preventDefault();
    setLoading(true);

    axios
      .post(`${environment[0]}/server/Lists/SharedLists/SendMail.php`, {
        mail: mail,
        lists_id: lists_id,
        name: localStorage.getItem("name"),
      })
      .then(function (response) {
        setLoading(false);
        console.log(response.data);

        // If response if good
        if (response.data.code === 200) {
          props.showShareList();
          setMail("");
        } else {
        }
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <div className="addTask">
      <h2>Del liste</h2>
      <form onSubmit={share}>
        <input
          autoFocus
          type="text"
          name="name"
          className="inputBox"
          placeholder="Indtast mail"
          required
          autoComplete="off"
          onChange={(e) => setMail(e.target.value)}
        />
        {loading ? (
          <div className="loading">
            <TailSpin color="#000000" height={40} width={40} />
          </div>
        ) : (
          <div>
            <button type="button" onClick={props.showShareList}>
              Tilbage
            </button>
            <button type="submit">Del liste</button>
          </div>
        )}
      </form>
    </div>
  );
};
export default ShareList;
