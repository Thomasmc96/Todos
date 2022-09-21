import React, { useState, useEffect } from "react";

const Members = (props) => {
    return (
        <div className='members popup'>
            <span className="cross" onClick={props.showMembers}>x</span>
            <h2>Medlemmer</h2>
            <div>...</div>
        </div>
    )
}

export default Members