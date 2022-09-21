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
                    <p>Medlemmer</p>
                    <img className='icon' src={membersIcon} alt="Medlemmer ikon" />
                </button>
                {props.list.users_id === localStorage.getItem("users_id") && (
                    <React.Fragment>
                        <button type='button' onClick={props.showShareList}>
                            <p>Del liste</p>
                            <img className="shareIcon icon" src={shareIcon} alt="Del liste ikon" />
                        </button>
                        <button type='button' className='danger' onClick={props.showDeleteList}>
                            <p>Slet liste</p>
                            <img className="deleteList icon" src={deleteIcon} alt="Slet liste ikon" />
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
