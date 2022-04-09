import React, { useState } from "react";
import axios from "axios";

const DeleteList = (props) =>{

    const [listName, setListName] = useState('')

    const deleteList = (event) => {
        event.preventDefault(); 

        axios.post('http://localhost:8000/server/lists/create.php', {
            name: listName,
          })
          .then(function (response) {
            console.log(response);
            if(response.status === 200){
                props.setLists([...props.lists, {lists_id: response.data.lists_id, name: listName}])
            } else {

            }
          })
          .catch(function (error) {
            console.log(error);
          });

        props.showDeleteList();
    } 

    const handleListName = (event) => {
        setListName(event.target.value);
    }

    return (
    <div className="deleteList">
        <h2>Listen vil blive slettet permanent. <br /> Vil du slette listen?</h2>
        <form onSubmit={deleteList}>
        <div>
            <button onClick={props.showDeleteList}>Tilbage</button>
            <button id="deleteBtn" type="submit">Slet liste</button>
        </div>
        </form>
    </div>
    );
};
export default DeleteList;
