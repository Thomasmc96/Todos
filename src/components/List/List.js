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
import ShareList from "./ShareList.js";
import AddTask from "./AddTask.js";
import EditTask from "./EditTask.js";

const List = () => {
  // Params from URL
  const { id } = useParams();

  // States
  const [list, setList] = useState({
    list_name: "",
    products: [{ completed: "", name: "", products_id: "" }],
  });
  const [toggleAddTask, setToggleAddTask] = useState(false);
  const [toggleShareList, setToggleShareList] = useState(false);
  const [toggleEditTask, setToggleEditTask] = useState(0);
  const [showUncompletedTasks, setShowUncompletedTasks] = useState(false);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  useEffect(() => {
    axios(`http://localhost:8000/server/products/read.php?lists_id=${id}`)
      .then((result) => {
        // Save data to state
        setList(result.data);
        console.log(result.data);
        checkProducts(result.data.products);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Checks if the data contains any uncompleted and any completed tasks
  const checkProducts = (data) => {
    // Reset values
    setShowCompletedTasks(false);
    setShowUncompletedTasks(false);

    // Check if there are any completed or uncompleted tasks
    for (let i = 0; i < data.length; i++) {
      if (data[i].completed == "0") {
        setShowUncompletedTasks(true);
      } else if (data[i].completed == "1") {
        setShowCompletedTasks(true);
      }
    }
  };

  const showEditTask = (id) => {
    setToggleEditTask(id);
  };

  const showAddTask = () => {
    setToggleAddTask(!toggleAddTask);
  };

  const showShareList = () => {
    setToggleShareList(!toggleShareList);
  };

  const completeTask = (event, index, status) => {
    event.preventDefault();

    // Save state array in local variable
    let products = [...list.products];

    // Save the one product we are handling
    let product = products[index];

    // Set value for property
    product.completed = status;

    // Save product in local array
    products[index] = product;

    // API call
    axios
      .post("http://localhost:8000/server/products/update.php", {
        products_id: product.products_id,
        completed: status,
      })
      .then(function (response) {
        // If response if good
        if (response.data.code === 200) {
          // Save to state
          setList({ list_name: list.list_name, products: products });
          checkProducts(products);
        } else {
          console.log("Error");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
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
      {!showUncompletedTasks && (
        <p className="doneText">Alle opgaver er løst</p>
      )}
      {Array.isArray(list.products) &&
        list.products.map((product, i) => {
          if (product.completed == "0") {
            return (
              <div className="todoProduct" key={product.products_id}>
                <div className="doneOrNot">
                  <img
                    id="notDoneIcon"
                    src={notDoneIcon}
                    alt="Ikke-færdig ikon"
                    onClick={(event) => {
                      completeTask(event, i, 1);
                    }}
                  />
                  <p>{product.name}</p>
                </div>
                <img
                  onClick={() => showEditTask(product.products_id)}
                  id="editIcon"
                  src={editIcon}
                  alt="Redigér ikon"
                />
                {toggleEditTask === product.products_id && (
                  <EditTask
                    showEditTask={() => showEditTask(0)}
                    task={product}
                    setList={setList}
                    list={list}
                    index={i}
                  />
                )}
              </div>
            );
          }
        })}
      {showCompletedTasks && (
        <span>
          <hr className="hr" />
          <p className="doneText">Fuldførte opgave (slettes efter 30 min)</p>
        </span>
      )}
      {Array.isArray(list.products) &&
        list.products.map((product, i) => {
          if (product.completed == "1") {
            return (
              <div className="doneProduct" key={product.products_id}>
                <img
                  id="doneIcon"
                  src={doneIcon}
                  alt="Færdig ikon"
                  onClick={(event) => {
                    completeTask(event, i, 0);
                  }}
                />
                <p>{product.name}</p>
              </div>
            );
          }
        })}
      <div className="addSection" onClick={showAddTask}>
        <img src={addIcon} alt="Tilføj opgave ikon" />
        <p>Tilføj en opgave</p>
      </div>
      {toggleAddTask && (
        <AddTask showAddTask={showAddTask} setList={setList} list={list} />
      )}
      {toggleShareList && <ShareList showShareList={showShareList} />}
    </div>
  );
};

export default List;
