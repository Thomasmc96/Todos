import React, { useState, useEffect } from "react";
import "./Frontpage.css";
import addNewListIcon from "../../assets/img/icons_v2/add.svg";
import listIcon from "../../assets/img/icons_v2/small-list.svg";
import axios from "axios";
import AddNewList from "./AddNewList.js";
import { useNavigate, Link } from "react-router-dom";
import environment from "../../environment";
import { TailSpin } from "react-loader-spinner";
import AddButton from "../Utilities/AddButton";

const Frontpage = () => {
  const navigate = useNavigate();

  const [lists, setLists] = useState([]);
  const [sharedLists, setSharedLists] = useState([]);
  const [toggleNewList, setToggleNewList] = useState(false);
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

  return (
    <div className="frontpage">
      <div className="profileFront">
        {/* <p className="profileIcon">{initials}</p> */}
        <p className="profileName">Hej {localStorage.getItem("name")}!</p>
      </div>
      <section>
        <h3 className="listCategory">Mine lister</h3>
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
                  <img
                    className="listIcon icon"
                    src={listIcon}
                    alt="Liste ikon"
                  />
                  <p>{list.name}</p>
                </Link>
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
                  <img
                    className="listIcon icon"
                    src={listIcon}
                    alt="Liste ikon"
                  />
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
        <AddButton showPopUp={showNewList}/>
      )}
    </div>
  );
};

export default Frontpage;
