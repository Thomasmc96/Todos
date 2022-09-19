import React, { useState, useEffect } from "react";
import "./Frontpage.css";
import addNewListIcon from "../../assets/img/add-new-list.svg";
import listIcon from "../../assets/img/small-list.svg";
import deleteIcon from "../../assets/img/delete.svg";
import axios from "axios";
import AddNewList from "./AddNewList.js";
import DeleteList from "./DeleteList.js";
import { useNavigate, Link } from "react-router-dom";
import environment from "../../environment";
import { TailSpin } from "react-loader-spinner";

const Frontpage = () => {
  const navigate = useNavigate();

  const [lists, setLists] = useState([]);
  const [sharedLists, setSharedLists] = useState([]);
  const [toggleNewList, setToggleNewList] = useState(false);
  const [toggleDeleteList, setToggleDeleteList] = useState(0);
  const [loadingLists, setLoadingLists] = useState(false);
  const [loadingSharedLists, setLoadingSharedLists] = useState(false);

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
    if (!users_id) {
      navigate("/login");
    }
    setLoadingLists(true);
    setLoadingSharedLists(true);
    // Get lists made by current user
    axios(`${environment[0]}/server/Lists/Read.php?users_id=${users_id}`)
      .then((result) => {
        setLists(result.data);
        setLoadingLists(false);
      })
      .catch((error) => {
        console.log(error);
        setLoadingLists(false);
      });

    // Get lists shared for the current user
    axios(
      `${environment[0]}/server/Lists/SharedLists/Read.php?users_id=${users_id}`
    )
      .then((result) => {
        setSharedLists(result.data);
        setLoadingSharedLists(false);
      })
      .catch((error) => {
        console.log(error);
        setLoadingSharedLists(false);
      });
  }, []);

  // Toggle the popup box for adding new list
  const showNewList = () => {
    setToggleNewList(!toggleNewList);
  };
  const showDeleteList = (id) => {
    setToggleDeleteList(id);
  };

  return (
    <div className="frontpage">
      <div className="profileFront">
        <p className="profileIcon">{initials}</p>
        <p className="profileName">{localStorage.getItem("name")}</p>
      </div>
      {/* <hr className="hr" /> */}
      {/* <img
        className="addNewListIcon"
        src={addNewListIcon}
        alt="Tilføj ny liste"
        onClick={showNewList}
      /> */}
      <section>
        <h3 className="listCategory">Lister oprettet af mig</h3>
        <hr className="hrList" />
        {loadingLists ? (
          <div className="loading">
            <TailSpin color="#000000" height={40} width={40} />
          </div>
        ) : Array.isArray(lists) && lists.length > 0 ? (
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
                  onClick={() => showDeleteList(list.lists_id)}
                />
                {toggleDeleteList === list.lists_id && (
                  <DeleteList
                    showDeleteList={() => showDeleteList(0)}
                    setLists={setLists}
                    lists_id={list.lists_id}
                  />
                )}
              </div>
            );
          })
        ) : (
          // Empty lists
          Array.isArray(lists) &&
          lists.length === 0 && (
            <div className="list listLink">Her er tomt...</div>
          )
        )}
      </section>
      <section>
        <h3 className="listCategory">Lister delt med mig</h3>
        <hr className="hrList" />
        {loadingSharedLists ? (
          <div className="loading">
            <TailSpin color="#000000" height={40} width={40} />
          </div>
        ) : Array.isArray(sharedLists) && sharedLists.length > 0 ? (
          sharedLists.map((sharedList) => {
            return (
              <div className="list" key={sharedList.lists_id}>
                <Link to={"/list/" + sharedList.lists_id} className="listLink">
                  <img className="listIcon" src={listIcon} alt="Liste ikon" />
                  <div className="sharedContainer">
                    <p>{sharedList.name}</p>
                    <span className="sharedBy">
                      {"(af " + sharedList.users_name + ")"}
                    </span>
                  </div>
                </Link>
              </div>
            );
          })
        ) : (
          // Empty shared lists
          Array.isArray(sharedLists) &&
          sharedLists.length === 0 && (
            <div className="list listLink">Her er tomt...</div>
          )
        )}
      </section>

      {toggleNewList && (
        <AddNewList
          showNewList={showNewList}
          setLists={setLists}
          lists={lists}
        />
      )}
      {!toggleNewList && (
        <div className="addSection" onClick={showNewList}>
          <img
            className="addNewListIcon"
            src={addNewListIcon}
            alt="Tilføj ny liste"
          />
          <p>Tilføj en liste</p>
        </div>
      )}

    </div>
  );
};

export default Frontpage;
