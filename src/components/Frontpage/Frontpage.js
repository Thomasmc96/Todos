import React, { useState, useEffect } from "react";
import "./Frontpage.css";
import addNewListIcon from "../../assets/img/add-new-list.svg";
import listIcon from "../../assets/img/small-list.svg";
import deleteIcon from "../../assets/img/delete.svg";
import axios from "axios";
import AddNewList from "./AddNewList.js";
import DeleteList from "./DeleteList.js";
import { Link } from "react-router-dom";

const Frontpage = () => {
  const [lists, setLists] = useState([]);
  const [toggleNewList, setToggleNewList] = useState(false);
  const [toggleDeleteList, setToggleDeleteList] = useState(false);

  // Get name and initials from local storage
  if (localStorage.getItem("name") !== null) {
    const nameArray = localStorage.getItem("name").split(" ");
    var initials = "";
    for (let i = 0; i < nameArray.length; i++) {
      initials += nameArray[i].charAt(0);
    }
  }

  useEffect(() => {
    const users_id = localStorage.getItem("users_id");
    console.log(users_id);
    axios(`http://localhost:8000/server/lists/read.php?users_id=${users_id}`)
      .then((result) => {
        console.log(result.data);
        setLists(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Toggle the popup box for adding new list
  const showNewList = () => {
    setToggleNewList(!toggleNewList);
  };
  const showDeleteList = () => {
    setToggleDeleteList(!toggleDeleteList);
  };

  const deleteList = (e, lists_id) => {
    e.preventDefault();
    console.log(lists_id);
    // API call
    axios
      .post("http://localhost:8000/server/lists/delete.php", {
        lists_id: lists_id,
      })
      .then(function (response) {
        console.log(response);
        // If response if good
        if (response.data.code === 200) {
          console.log("deleted");
        } else {
          // Show error message
          console.log("error");
        }
      })
      .catch(function (error) {
        // Another error message
        console.log(error);
      });
  };

  return (
    <div className="frontpage">
      <div className="profileFront">
        <p className="profileIcon">{initials}</p>
        <p className="profileName">{localStorage.getItem("name")}</p>
      </div>
      <hr className="hr" />
      <img
        className="addNewListIcon"
        src={addNewListIcon}
        alt="Tilføj ny liste"
        onClick={showNewList}
      />
      <section>
        <h3 className="listCategory">Lister oprettet af mig</h3>
        <hr className="hrList" />
        {lists.length > 0 &&
          lists.map((list) => {
            return (
              <div className="list" key={list.lists_id}>
                <Link to={"/list/" + list.lists_id} className="listLink">
                  <img className="listIcon" src={listIcon} alt="Liste ikon" />
                  <p>{list.name}</p>
                </Link>
                <img
                  className="deleteIcon"
                  src={deleteIcon}
                  alt="Delete ikon"
                  onClick={showDeleteList}
                />
                {toggleDeleteList && (
                  <DeleteList
                    showDeleteList={showDeleteList}
                    setLists={setLists}
                    lists_id={list.lists_id}
                  />
                )}
              </div>
            );
          })}
      </section>
      {/* <section>
        <h3 className="listCategory">Lister delt med mig</h3>
        <img
          className="sharedListIcon"
          src={sharedList}
          alt="Delt med mig - ikon"
        />
        <hr className="hrList" />
        {lists.length > 0 && lists.map((list) => {
          return(
          <div key={list.lists_id} className="list">
            <img className="listIcon" src={listIcon} alt="Liste ikon" />
            <p>{list.name}</p>
          </div>
          )
        })}
      </section> */}

      {toggleNewList && (
        <AddNewList
          showNewList={showNewList}
          setLists={setLists}
          lists={lists}
        />
      )}
    </div>
  );
};

export default Frontpage;
