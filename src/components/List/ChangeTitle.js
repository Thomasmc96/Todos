import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import environment from '../../environment';
import { TailSpin } from 'react-loader-spinner';
import cross from '../../assets/img/icons_v2/cross.svg';

const ChangeTitle = (props) => {
  const params = useParams();
  const lists_id = params.id;

  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState();

  const hidePopup = useCallback(
    (event) => {
      const box = document.querySelector('.popup');

      if (!event.target.classList.contains('cross'))
        if (!box.contains(event.target)) {
          props.showChangeTitle(false);
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

  const change = (event) => {
    event.preventDefault();
    setLoading(true);

    axios
      .post(`${environment[0]}/server/Lists/ChangeTitle.php`, {
        title: title,
        lists_id: lists_id,
      })
      .then(function (response) {
        setLoading(false);
        setStatusCode(response.data.code);
        console.log(response)

        // If response if good
        if (response.data.code === 200) {
            let listCopy = props.list;
            listCopy.list_name = title
            props.setList(listCopy)
            setTitle('');
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
        onClick={props.showChangeTitle}
      />
      <h2>Ændre listens titel</h2>
      <form onSubmit={change}>
        <input
          autoFocus
          type="text"
          name="name"
          className="inputBox"
          placeholder="Indtast ny titel"
          required
          autoComplete="off"
          onChange={(e) => setTitle(e.target.value)}
        />
        {statusCode && statusCode === 500 && (
          <p>Kunne ikke ændres - prøv igen</p>
        )}
        {statusCode && statusCode === 200 && <p>Listens titel er ændret!</p>}
        {loading ? (
          <div className="loading">
            <TailSpin color="#000000" height={40} width={40} />
          </div>
        ) : (
          <div>
            <button type="submit">Ændre titel</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ChangeTitle;
