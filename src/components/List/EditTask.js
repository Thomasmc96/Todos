import React, { useState } from "react";


const EditTask = (props) => {

    const edit = () => {

    }

    return (
    <div className="addTask">
        <h2>Skift navn på punktet</h2>
        <input
          type="text"
          name="name"
          className="inputBox"
          placeholder="Skriv her"
          required
          autoComplete="off"
        />
        <div>
            <button type="button" onClick={props.showEditTask}>
            Tilbage
            </button>
            <button type="submit" onClick={edit}>Gem</button>
        </div>
    </div>
    );
};
export default EditTask;