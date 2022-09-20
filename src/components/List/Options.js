import React from 'react'
import shareIcon from "../../assets/img/share.svg";
import leaveIcon from "../../assets/img/leave.svg";

const Options = (props) => {
    return (
        <div className='options popup'>
            <span className="cross" onClick={props.showOptions}>x</span>
            <h2>Valgmuligheder</h2>
            <div>
                {props.list.users_id === localStorage.getItem("users_id") && (
                    <button type='button' onClick={props.showShareList}>
                        <p>Del liste</p>
                        <img className="shareIcon icon" src={shareIcon} alt="Del liste ikon" />
                    </button>
                )}
                {props.list.users_id !== localStorage.getItem("users_id") && (
                    <button className='danger' onClick={props.showLeaveList}>
                        <p>Forlad liste</p>
                        <img className='leaveIcon icon' src={leaveIcon} alt="Forlad liste ikon" />
                    </button>
                )}
            </div>
        </div>
    )
}
export default Options
