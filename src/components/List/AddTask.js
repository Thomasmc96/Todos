import React, { useState } from "react";
import axios from "axios";

const AddTask = (props) =>{

    const [taskName, setTaskName] = useState('')

    const pushTask = (event) => {
        event.preventDefault(); 

        axios.post('http://localhost:8000/server/products/create.php', {
            name: taskName, 
            lists_id: 2,
          })
          .then(function (response) {
            console.log(response);
            if(response.status === 200){
                // props.setList([...props.list, {lists_id: response.data.lists_id, name: listName}])
            } else {

            }
          })
          .catch(function (error) {
            console.log(error);
          });

        props.showAddTask();
    } 

    const handleTaskName = (event) => {
        setTaskName(event.target.value);
    }

    return (
    <div className="addTask">
        <h2>Tilføj en opgave</h2>
        <form onSubmit={pushTask}>
        <input type="text" name="name" className="inputBox" placeholder="Skriv her" required autoComplete="off" value={taskName} onChange={handleTaskName}/>
        <div>
            <button onClick={props.showAddTask}>Tilbage</button>
            <button type="submit">Tilføj</button>
        </div>
        </form>
    </div>
    );
};
export default AddTask;
