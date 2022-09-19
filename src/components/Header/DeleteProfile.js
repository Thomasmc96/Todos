import React, { useState } from "react";
import axios from "axios";
import environment from "../../environment";
import { TailSpin } from "react-loader-spinner";

const DeleteProfile = (props) => {

    const [loading, setLoading] = useState(false);

    const deleteEverything = (e) => {
        e.preventDefault();
        setLoading(true);

        // API call
        axios
            .post(`${environment[0]}/server/Users/DeleteProfile.php`, {
                users_id: localStorage.getItem("users_id"),
            })
            .then(function (response) {
                setLoading(false);

                console.log(response);

                // If response if good
                if (response.data.code === 200) {
                    localStorage.removeItem("token", response.data.jwt);
                    localStorage.removeItem("name", response.data.name);
                    localStorage.removeItem("users_id", response.data.id);
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
    };

    return (
        <div className="deleteProfile">
            <h2>Er du sikker?</h2>
            <p>Alle dine data vil blive slettet inkl. dine lister og opgaver.</p>
            <div>
                <button type="button" onClick={props.handleDeleteProfile}>Tilbage</button>
                {loading ? (
                    <button type="button" className="delete" onClick={deleteEverything}> <TailSpin color="#000000" height={20} width={20} /></button>

                ) : (
                    <button type="button" className="delete" onClick={deleteEverything}>Slet data</button>
                )}
            </div>
        </div>
    )
}
export default DeleteProfile;