import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ShareList = (props) => {
  const params = useParams();
  const lists_id = params.id;

  const [mail, setMail] = useState("");

  const share = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:8000/server/lists/sharedlists/sendmail.php", {
        mail: mail,
        lists_id: lists_id,
        name: localStorage.getItem("name"),
      })
      .then(function (response) {
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
      });
  };

  return (
    <div className="addTask">
      <h2>Del liste</h2>
      <form onSubmit={share}>
        <input
          type="text"
          name="name"
          className="inputBox"
          placeholder="Indtast mail"
          required
          autoComplete="off"
          onChange={(e) => setMail(e.target.value)}
        />
        <div>
          <button type="button" onClick={props.showShareList}>
            Tilbage
          </button>
          <button type="submit">Del liste</button>
        </div>
      </form>
    </div>
  );
};
export default ShareList;
