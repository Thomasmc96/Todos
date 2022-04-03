import React, { useState, useEffect } from "react";
import "./Frontpage.css";
import addNewListIcon from "../../assets/img/add-new-list.svg";
import listIcon from "../../assets/img/small-list.svg";
import sharedList from "../../assets/img/shared-list.svg";
import axios from "axios";
import AddNewList from './AddNewList.js';
import { Link } from "react-router-dom";

const Frontpage = () => {

  const [lists, setLists] = useState([])
  const [toggleNewList, setToggleNewList] = useState(false)

  useEffect(() => {
    axios("http://localhost:8000/server/lists/read.php")
      .then((result) => {
        console.log(result.data);
        setLists(result.data)
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const showNewList = () => {
    setToggleNewList(!toggleNewList)
  }

  return (
    <div className="frontpage">
      <div className="profileFront">
        <p className="profileIcon">DH</p>
        <p className="profileName">Ditte Hansen</p>
      </div>
      <hr className="hr" />
      <img className="addNewListIcon" src={addNewListIcon} alt="Tilføj ny liste" onClick={showNewList}/>
      <section>
        <h3 className="listCategory">Lister oprettet af mig</h3>
        <hr className="hrList" />
        {lists.length > 0 && lists.map((list) => {
          return(
          <Link to={'/list/'+list.lists_id} key={list.lists_id} className="list">
            <img className="listIcon" src={listIcon} alt="Liste ikon" />
            <p>{list.name}</p>
          </Link>
          )
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

       {toggleNewList && 
          <AddNewList showNewList={showNewList} setLists={setLists} lists={lists}/>
        }
   
    </div>
  );
};

export default Frontpage;
