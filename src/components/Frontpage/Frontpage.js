import React, {useState, useEffect} from "react";
import './Frontpage.css';
import addNewList from '../../assets/img/add-new-list.svg';
import list from '../../assets/img/small-list.svg';
import sharedList from '../../assets/img/shared-list.svg';
import axios from 'axios';

const Frontpage = () => {

  useEffect(() => {
      axios('localhost:8000/server/Lists/Read.php').then((result) => {
        console.log(result)
      }).catch((error) => {
        console.log(error)
      })

  });

  return (
  <div className="frontpage">
    <div className="profileFront">
      <p className="profileIcon">DH</p>
      <p className="profileName">Ditte Hansen</p>
    </div>
    <hr className="hr" />
    <img className="addNewListIcon" src={addNewList} alt="Tilføj ny liste" />
    <section>
      <h3 className="listCategory">Lister oprettet af mig</h3>
      <hr className="hrList" />
      <div className="list">
      <img className="listIcon" src={list} alt="Liste ikon" />
      <p>Pakkeliste</p>
      </div>
    </section>
    <section>
      <h3 className="listCategory">Lister delt med mig</h3>
      <img className="sharedListIcon" src={sharedList} alt="Delt med mig - ikon" />
      <hr className="hrList" />
      <div className="list">
        <img className="listIcon" src={list} alt="Liste ikon" />
        <p>Indkøbsliste</p>
      </div>
    </section>

  </div>
  );
};

export default Frontpage;
