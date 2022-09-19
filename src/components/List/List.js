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
import environment from "../../environment";
import { TailSpin } from "react-loader-spinner";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";

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
  const [loading, setLoading] = useState(false);

  console.log(list.products);
  useEffect(() => {
    setLoading(true);
    axios(`${environment[0]}/server/Products/Read.php?lists_id=${id}&users_id=${localStorage.getItem("users_id")}`)
      .then((result) => {
        // Check user is allowed to see list
        // if (result.data.users_id !== localStorage.getItem("users_id")) {
        let sharedUsers = result.data.shared_users;

        setLoading(false);

        if (
          result.data.users_id === localStorage.getItem("users_id") ||
          sharedUsers.includes(localStorage.getItem("users_id"))
        ) {
          console.log(result.data);
          // Save data to state
          setList(result.data);
          checkProducts(result.data.products);
        } else {
          window.location.replace("/");
        }
      })
      .catch((error) => {
        setLoading(false);
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
    console.log(event);
    console.log(index);
    console.log(status);
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
      .post(`${environment[0]}/server/Products/Update.php`, {
        products_id: product.products_id,
        completed: status,
      })
      .then(function (response) {
        console.log(response.data);
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

  const SortableItem = SortableElement(({ product, i }) => (
    <div className="todoProduct" key={product.products_id}>
      <div className="doneOrNot">

        <img
          onClick={() => showEditTask(product.products_id)}
          src={editIcon}
          id="editIcon"
          alt="Redigér ikon"
        />
        <p>{product.name}</p>
      </div>
      <img
        id="notDoneIcon"
        src={notDoneIcon}
        alt="Ikke-færdig ikon"
        onClick={(event) => {
          // console.log(event);
          completeTask(event, i, 1);
        }}
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
  ));

  const SortableList = SortableContainer(({ list }) => {
    return (
      <div className="sortTasks">
        {Array.isArray(list.products) &&
          list.products
            .sort((a, b) => a.sort_index - b.sort_index)
            .map((product, i) => {
              if (product.completed == "0") {
                return (
                  <SortableItem
                    product={product}
                    i={i}
                    index={i}
                    key={product.products_id}
                  />
                );
              }
            })}
      </div>
    );
  });

  const onSortEnd = ({ oldIndex, newIndex }) => {
    // let productsTemp = list.products;
    let arr = arrayMoveImmutable(list.products, oldIndex, newIndex);
    for (let i = 0; i < arr.length; i++) {
      arr[i].sort_index = i;
    }
    setList({
      list_name: list.list_name,
      users_id: list.users_id,
      products: arr,
    });
    console.log(arr);
    // API call
    axios
      .post(`${environment[0]}/server/Products/Update.php`, {
        products: arr,
      })
      .then(function (response) {
        console.log(response.data);
        // If response if good
        if (response.data.code === 200) {
          console.log("Success");
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
        {list.users_id === localStorage.getItem("users_id") && (
          <div className="shareSection" onClick={showShareList}>
            <p>Del liste</p>
            <img id="share" src={shareIcon} alt="Del liste ikon" />
          </div>
        )}
      </div>
      <hr className="hr" />
      <h1>{list.list_name}</h1>
      <hr className="hr" />
      <div className="tasks">
        {!showUncompletedTasks &&
          Array.isArray(list.products) &&
          list.products.length > 0 && (
            <p className="doneText">Alle opgaver er løst</p>
          )}
        {!showUncompletedTasks &&
          Array.isArray(list.products) &&
          list.products.length === 0 && <p className="doneText">Her er der bare luft.</p>}
        {loading ? (
          <div className="loading">
            <TailSpin color="#000000" height={60} width={60} />
          </div>
        ) : (
          Array.isArray(list.products) && (
            <SortableList list={list} onSortEnd={onSortEnd} pressDelay={150} />
          )
          // list.products.map((product, i) => {
          //   if (product.completed == "0") {
          //     return (
          //       <div className="todoProduct" key={product.products_id}>
          //         <div className="doneOrNot">
          //           <img
          //             id="notDoneIcon"
          //             src={notDoneIcon}
          //             alt="Ikke-færdig ikon"
          //             onClick={(event) => {
          //               completeTask(event, i, 1);
          //             }}
          //           />
          //           <p>{product.name}</p>
          //         </div>
          //         <img
          //           onClick={() => showEditTask(product.products_id)}
          //           id="editIcon"
          //           src={editIcon}
          //           alt="Redigér ikon"
          //         />
          //         {toggleEditTask === product.products_id && (
          //           <EditTask
          //             showEditTask={() => showEditTask(0)}
          //             task={product}
          //             setList={setList}
          //             list={list}
          //             index={i}
          //           />
          //         )}
          //       </div>
          //     );
          //   }
          // })
        )}
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
                  <p>{product.name}</p>
                  <img
                    id="doneIcon"
                    src={doneIcon}
                    alt="Færdig ikon"
                    onClick={(event) => {
                      completeTask(event, i, 0);
                    }}
                  />
                </div>
              );
            }
          })}
      </div>
      {!toggleAddTask && !toggleEditTask && (
        <div className="addSection" onClick={showAddTask}>
          <img src={addIcon} alt="Tilføj opgave ikon" />
          <p>Tilføj en opgave</p>
        </div>
      )}
      {toggleAddTask && (
        <AddTask showAddTask={showAddTask} setList={setList} list={list} setShowUncompletedTasks={setShowUncompletedTasks} />
      )}
      {toggleShareList && <ShareList showShareList={showShareList} />}
    </div>
  );
};

export default List;
