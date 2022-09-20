import React, { useState } from "react";
import axios from "axios";
import environment from "../../environment";
import { TailSpin } from "react-loader-spinner";
import { useParams } from "react-router-dom";

const LeaveList = (props) => {

    // Params from URL
    const { id } = useParams();

    const [loading, setLoading] = useState(false);

    const leaveList = (e) => {
        e.preventDefault();
        setLoading(true);

        // API call
        axios
            .post(`${environment[0]}/server/Lists/SharedLists/Delete.php`, {
                users_id: localStorage.getItem("users_id"),
                lists_id: id
            })
            .then(function (response) {
                setLoading(false);

                console.log(response);

                // If response if good
                if (response.data.code === 200) {
                    window.location.replace("/");
                } else {
                    // Show error message
                    console.log('Something went wrong')
                }
            })
            .catch(function (error) {
                // Another error message
                console.log(error);
                setLoading(false);
            });
    }

    return (
        <div className='leaveList popup'>
            <span className="cross" onClick={props.showLeaveList}>x</span>
            <h2>Forlad listen?</h2>
            <p>
                Er du sikker på du vil forlade listen?
            </p>
            {loading ? (
                <div>
                    <button type="button" disabled className="danger"> <TailSpin color="#000000" height={20} width={20} /></button>
                </div>
            ) : (
                <div>
                    <button type="button" className='danger' onClick={leaveList}>Forlad</button>
                </div>
            )
            }
        </div>
    )
}

export default LeaveList