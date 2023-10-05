import React from "react";
import addNewListIcon from '../../assets/img/icons_v2/add.svg'

const AddButton = ({showPopUp}) => {
    return (
        <div className="addSection" id="addListBtn" onClick={showPopUp}>
            <img
                className="addNewListIcon"
                src={addNewListIcon}
                alt="Tilføj ny liste"
            />
        </div>
    )
};

export default AddButton;
