import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, Link } from "react-router-dom";
import environment from "../../environment";
import { TailSpin } from "react-loader-spinner";

const JoinList = () => {
  // Get query params
  const [searchParams] = useSearchParams();
  const users_id = searchParams.get("users_id");
  const lists_id = searchParams.get("lists_id");

  // States
  const [loading, setLoading] = useState(false);
  const [responseCode, setResponseCode] = useState();

  useEffect(() => {
    setLoading(true);
    axios(
      `${environment[0]}/server//Lists/SharedLists/Create.php?lists_id=${lists_id}&users_id=${users_id}`
    )
      .then((result) => {
        console.log(result.data);
        setResponseCode(result.data.code);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setResponseCode(500);
        setLoading(false);
      });
  }, []);

  // Check for loading and response code
  if (loading) {
    return (
      <div>
        <div className="loading">
          <TailSpin color="#000000" height={60} width={60} />
        </div>
      </div>
    );
    // testing url: http://localhost:3000/join-list?lists_id=19&lists_id=36
  } else if (responseCode === 200) {
    return (
      <div className="joinListResponse">
        <p className="success">Succes!</p>
        <Link to={"/list/" + lists_id}>
          <button className="button">Se listen</button>
        </Link>
      </div>
    );
  } else if (responseCode === 403) {
    return (
      <div className="joinListResponse">
        <p className="warning">Du er allerede tilknyttet listen</p>
        <Link to={"/list/" + lists_id}>
          <button className="button">Se listen</button>
        </Link>
      </div>
    );
  } else {
    return (
      <div className="joinListResponse error">
        <p className="error">Fejl</p>
        <Link to={"/"}>
          <button className="button">Tilbage</button>
        </Link>
      </div>
    );
  }
};
export default JoinList;
