import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ShareList = (props) => {

    const share = () => {

    }

    return (
    <div className="addTask">
        <h2>Del liste</h2>
        <form onSubmit={share}>
        <input
            type="text"
            name="name"
            className="inputBox"
            placeholder="Del med denne email"
            required
            autoComplete="off"
  
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