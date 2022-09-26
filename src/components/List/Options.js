import React from 'react'
import shareIcon from "../../assets/img/share.svg";
import leaveIcon from "../../assets/img/leave.svg";
import deleteIcon from "../../assets/img/delete.svg";
import membersIcon from "../../assets/img/shared-list.svg";

const Options = (props) => {
    return (
        <div className='options popup'>
            <span className="cross" onClick={props.showOptions}>x</span>
            <h2>Valgmuligheder</h2>
            <div>
                <button type='button' onClick={props.showMembers}>
                    <img className='icon' src={membersIcon} alt="Medlemmer ikon" />
                    <p>Medlemmer</p>
                </button>
                {props.list.users_id === localStorage.getItem("users_id") && (
                    <React.Fragment>
                        <button type='button' onClick={props.showShareList}>
                            <img className="shareIcon icon" src={shareIcon} alt="Del liste ikon" />
                            <p>Del liste</p>
                        </button>
                        <button type='button' className='danger' onClick={props.showDeleteList}>
                            <img className="deleteList icon" src={deleteIcon} alt="Slet liste ikon" />
                            <p>Slet liste</p>
                        </button>
                    </React.Fragment>
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
