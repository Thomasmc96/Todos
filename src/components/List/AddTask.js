import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import environment from '../../environment';
import { TailSpin } from 'react-loader-spinner';
import cross from '../../assets/img/icons_v2/cross.svg';

const AddTask = (props) => {
  const { id } = useParams();

  const [taskName, setTaskName] = useState('');
  const [loading, setLoading] = useState(false);

  const hidePopup = useCallback(
    (event) => {
      const box = document.querySelector('.popup');

      if (
        !event.target.classList.contains('addSection') &&
        !event.target.classList.contains('cross')
      )
        if (!box.contains(event.target)) {
          props.showAddTask(false);
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

  // Function that adds a new task to the users list
  const pushTask = (event) => {
    event.preventDefault();
    setLoading(true);
    axios
      .post(`${environment[0]}/server/Products/Create.php`, {
        name: taskName,
        lists_id: id,
        users_id: localStorage.getItem('users_id'),
      })
      .then(function (response) {
        setLoading(false);
        // If response is good
        if (response.status === 200) {
          props.setList({
            list_name: props.list.list_name,
            users_id: props.list.users_id,
            products: [
              ...props.list.products,
              {
                completed: '0',
                products_id: response.data.products_id,
                name: taskName,
              },
            ],
          });
          props.setShowUncompletedTasks(true);

          setTaskName('');
          document.getElementById('taskNameBox').focus();
          document.getElementById('addTaskHeader').innerHTML =
            'Tilføj en opgave mere';
        } else {
        }
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  // Handles users input when typing task name
  const handleTaskName = (event) => {
    setTaskName(event.target.value);
  };

  return (
    <div className="addTask popup">
      <img
        src={cross}
        alt="lukned-knap"
        className="cross"
        onClick={props.showLeaveList}
      />
      <h2 id="addTaskHeader">Tilføj en opgave</h2>
      <form onSubmit={pushTask}>
        <input
          id="taskNameBox"
          autoFocus
          type="text"
          name="name"
          className="inputBox"
          placeholder="Skriv her"
          required
          autoComplete="off"
          value={taskName}
          onChange={handleTaskName}
        />
        {loading ? (
          <div className="loading">
            <TailSpin color="#000000" height={40} width={40} />
          </div>
        ) : (
          <div>
            <button type="submit">Tilføj</button>
          </div>
        )}
      </form>
    </div>
  );
};
export default AddTask;
