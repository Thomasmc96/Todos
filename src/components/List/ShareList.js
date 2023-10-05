import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import environment from '../../environment';
import { TailSpin } from 'react-loader-spinner';
import cross from "../../assets/img/icons_v2/cross.svg";

const ShareList = (props) => {
  const params = useParams();
  const lists_id = params.id;

  const [mail, setMail] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState();

  const hidePopup = useCallback(
    (event) => {
      const box = document.querySelector('.popup');

      if (!event.target.classList.contains('cross'))
        if (!box.contains(event.target)) {
          props.showShareList(false);
        }
    },
    [props]
  );

  useEffect(() => {
    window.addEventListener('click', hidePopup);

    return () => {
      window.removeEventListener('click', hidePopup);
    };
  }, [hidePopup]);

  const share = (event) => {
    event.preventDefault();
    setLoading(true);

    axios
      .post(`${environment[0]}/server/Lists/SharedLists/SendMail.php`, {
        mail: mail,
        lists_id: lists_id,
        name: localStorage.getItem('name'),
        created_by: localStorage.getItem('users_id'),
      })
      .then(function (response) {
        setLoading(false);
        setStatusCode(response.data.code);

        // If response if good
        if (response.data.code === 200) {
          setMail('');
        } else {
        }
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <div className="addTask popup">
      <img
        src={cross}
        alt="lukned-knap"
        className="cross"
        onClick={props.showLeaveList}
      />
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
        {statusCode && statusCode === 500 && (
          <p>Kunne ikke deles - prøv igen</p>
        )}
        {statusCode && statusCode === 404 && (
          <p>Kunne ikke deles - er mailen forkert?</p>
        )}
        {statusCode && statusCode === 200 && <p>Listen blev delt!</p>}
        {loading ? (
          <div className="loading">
            <TailSpin color="#000000" height={40} width={40} />
          </div>
        ) : (
          <div>
            <button type="submit">Del liste</button>
          </div>
        )}
      </form>
    </div>
  );
};
export default ShareList;
