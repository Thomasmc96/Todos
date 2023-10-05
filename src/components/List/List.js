import React, { useState, useEffect } from "react";
import "./List.css";
import backIcon from "../../assets/img/icons_v2/arrow.svg";
import dotsIcon from "../../assets/img/dots.svg";
import editIcon from "../../assets/img/icons_v2/edit.svg";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import AddTask from "./AddTask.js";
import EditTask from "./EditTask.js";
import environment from "../../environment";
import { TailSpin } from "react-loader-spinner";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import Options from "./Options";
import ShareList from "./ShareList.js";
import LeaveList from "./LeaveList.js";
import DeleteList from "./DeleteList.js";
import Members from "./Members.js";
import AddButton from "../Utilities/AddButton";
import ChangeTitle from './ChangeTitle';

const List = () => {

  // Params from URL
  const { id } = useParams();

  const users_id = localStorage.getItem("users_id");

  // States
  const [list, setList] = useState({
    list_name: "",
    products: [{ completed: "", name: "", products_id: "" }],
  });
  const [toggleAddTask, setToggleAddTask] = useState(false);
  const [toggleEditTask, setToggleEditTask] = useState(0);
  const [toggleOptions, setToggleOptions] = useState(false);
  const [toggleLeaveList, setToggleLeaveList] = useState(false);
  const [toggleDeleteList, setToggleDeleteList] = useState(false);
  const [toggleMembers, setToggleMembers] = useState(false);
  const [showUncompletedTasks, setShowUncompletedTasks] = useState(false);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toggleShareList, setToggleShareList] = useState(false);
  const [toggleChangeTitle, setToggleChangeTitle] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios(
      `${environment[0]}/server/Products/Read.php?lists_id=${id}&users_id=${users_id}`
    )
      .then((result) => {
        // Check user is allowed to see list
        let sharedUsers = result.data.shared_users;

        setLoading(false);

        if (
          result.data.users_id === users_id ||
          sharedUsers.includes(users_id)
        ) {
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
    showOptions();
  };

  const showOptions = () => {
    setToggleOptions(!toggleOptions);
  };

  const showLeaveList = () => {
    setToggleLeaveList(!toggleLeaveList);
    showOptions();
  };

  const showDeleteList = () => {
    setToggleDeleteList(!toggleDeleteList);
    showOptions();
  };

  const showMembers = () => {
    setToggleMembers(!toggleMembers);
    showOptions();
  };

  const showChangeTitle = () => {
    setToggleChangeTitle(!toggleChangeTitle);
    showOptions();
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
      .post(`${environment[0]}/server/Products/Update.php`, {
        products_id: product.products_id,
        completed: status,
        users_id: users_id,
        lists_id_2: id,
      })
      .then(function (response) {
        // If response if good
        if (response.data.code === 200) {
          // Save to state
          setList({ list_name: list.list_name, products: products });
          checkProducts(products);
        } else {
          console.log(response);
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
      <input
        id="checkbox"
        type="checkbox"
        name="acceptCheckbox"
        value={1}
        onClick={(event) => {
          completeTask(event, i, 1);
        }}
      />
      {/* <img
        id="notDoneIcon"
        src={notDoneIcon}
        alt="Ikke-færdig ikon"
        onClick={(event) => {
          completeTask(event, i, 1);
        }}
      /> */}
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
    // API call
    axios
      .post(`${environment[0]}/server/Products/Update.php`, {
        products: arr,
        users_id: users_id,
        lists_id_2: id,
        dontNotify: true,
      })
      .then(function (response) {
        // If response if good
        if (response.data.code === 200) {
          console.log("Success");
        } else {
          console.log(response.data);
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
          <img id="back" className="icon" src={backIcon} alt="Tilbage ikon" />
          <p>Tilbage</p>
        </Link>
        <img
          className="optionsIcon icon"
          src={dotsIcon}
          alt="Valgmuligheder ikon"
          onClick={showOptions}
        />
      </div>
      <hr className="hr" />
      <h1>{list.list_name}</h1>
      <hr className="hr" />
      <div className="tasks">
        {!showUncompletedTasks &&
          !loading &&
          Array.isArray(list.products) &&
          list.products.length > 0 && (
            <p className="doneText">Alle opgaver er løst!</p>
          )}
        {!showUncompletedTasks &&
          Array.isArray(list.products) &&
          !loading &&
          list.products.length === 0 && (
            <p className="doneText">Der er ingen opgaver.</p>
          )}
        {loading ? (
          <div className="loading">
            <TailSpin color="#000000" height={60} width={60} />
          </div>
        ) : (
          Array.isArray(list.products) && (
            <SortableList list={list} onSortEnd={onSortEnd} pressDelay={150} />
          )
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
                  <input
                    id="checkbox"
                    type="checkbox"
                    name="acceptCheckbox"
                    checked="checked"
                    value={1}
                    onClick={(event) => {
                      completeTask(event, i, 0);
                    }}
                  />
                  {/* <img
                    id="doneIcon"
                    src={doneIcon}
                    alt="Færdig ikon"
                    onClick={(event) => {
                      completeTask(event, i, 0);
                    }}
                  /> */}
                </div>
              );
            }
          })}
      </div>
      {!toggleAddTask && !toggleEditTask && !toggleShareList && !toggleChangeTitle && (
        <AddButton showPopUp={showAddTask}/>
      )}
      {toggleAddTask && (
        <AddTask
          showAddTask={showAddTask}
          setList={setList}
          list={list}
          setShowUncompletedTasks={setShowUncompletedTasks}
        />
      )}
      {toggleOptions && (
        <Options
          showOptions={showOptions}
          list={list}
          showShareList={showShareList}
          showLeaveList={showLeaveList}
          showDeleteList={showDeleteList}
          showMembers={showMembers}
          showChangeTitle={showChangeTitle}
        />
      )}
      {toggleShareList && <ShareList showShareList={showShareList} />}
      {toggleLeaveList && <LeaveList showLeaveList={showLeaveList} />}
      {toggleDeleteList && <DeleteList showDeleteList={showDeleteList} />}
      {toggleMembers && <Members showMembers={showMembers} />}
      {toggleChangeTitle && <ChangeTitle showChangeTitle={showChangeTitle} list={list} setList={setList}/>}
    </div>
  );
};

export default List;
