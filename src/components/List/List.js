import React, { useState, useEffect } from "react";
import "./List.css";
import backIcon from "../../assets/img/back.svg";
import shareIcon from "../../assets/img/share.svg";
import notDoneIcon from "../../assets/img/not-done.svg";
import doneIcon from "../../assets/img/done.svg";
import editIcon from "../../assets/img/edit.svg";
import addIcon from "../../assets/img/add.svg";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import AddTask from "./AddTask.js";
import ShareList from "./ShareList.js";

const List = () => {
  const { id } = useParams();

  const [list, setList] = useState({
    list_name: "",
    products: [{ completed: "", name: "", products_id: "" }],
  });
  const [toggleAddTask, setToggleAddTask] = useState(false);

  const [toggleShareList, setToggleShareList] = useState(false);


  useEffect(() => {
    axios(`http://localhost:8000/server/products/read.php?lists_id=${id}`)
      .then((result) => {
        console.log(result.data);
        setList(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const showAddTask = () => {
    setToggleAddTask(!toggleAddTask);
  };

  const showShareList = () => {
    setToggleShareList(!toggleShareList);
  };

  return (
    <div className="listSection">
      <div className="firstSection">
        <Link to={"/"} className="backSection">
          <img id="back" src={backIcon} alt="Tilbage ikon" />
          <p>Tilbage</p>
        </Link>
        <div className="shareSection" onClick={showShareList}>
          <p>Del liste</p>
          <img id="share" src={shareIcon} alt="Del liste ikon" />
        </div>
      </div>
      <hr className="hr" />
      <h1>{list.list_name}</h1>
      <hr className="hr" />
      {list.products.map((product) => {
        if (product.completed == "0") {
          return (
            <div className="todoProduct" key={product.products_id}>
              <div className="doneOrNot">
                <img
                  id="notDoneIcon"
                  src={notDoneIcon}
                  alt="Ikke-færdig ikon"
                />
                <p>{product.name}</p>
              </div>
              <img id="editIcon" src={editIcon} alt="Redigér ikon" />
            </div>
          );
        }
      })}
      <hr className="hr" />
      <p id="doneText">Fuldførte opgave (slettes efter 5 min)</p>
      <div className="doneProduct">
          <img
            id="doneIcon"
            src={doneIcon}
            alt="Færdig ikon"
          />
          <p>Slik</p>
        </div>
      <div className="addSection" onClick={showAddTask}>
        <img src={addIcon} alt="Tilføj opgave ikon" />
        <p>Tilføj en opgave</p>
      </div>
      {toggleAddTask && (
        <AddTask showAddTask={showAddTask} setList={setList} list={list} />
      )}
      {toggleShareList && (
      <ShareList  showShareList={showShareList}/>
      )}
    </div>
  );
};

export default List;
