import React, {useState, useEffect} from "react";
import "./List.css";
import backIcon from "../../assets/img/back.svg";
import shareIcon from "../../assets/img/share.svg";
import notDoneIcon from "../../assets/img/not-done.svg";
import editIcon from "../../assets/img/edit.svg";
import addIcon from "../../assets/img/add.svg";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const List = () =>{
    const {id}=useParams()

    const [list, setList] = useState({list_name: '', products: [{completed: '', name: '', products_id: ''}]})
    
    useEffect(() => {
        axios(`http://localhost:8000/server/products/read.php?lists_id=${id}`)
          .then((result) => {
            console.log(result.data);
            setList(result.data)
          })
          .catch((error) => {
            console.log(error);
          });
      }, []);

    return(
        <div className="listSection">
            <div className="firstSection">
                <Link to={'/'} className="backSection">
                    <img id="back" src={backIcon} alt="Tilbage ikon" />
                    <p>Tilbage</p>
                </Link>
                <div className="shareSection">
                    <p>Del liste</p>
                    <img id="share" src={shareIcon} alt="Del liste ikon" />
                </div>
            </div>
            <hr className="hr" />
            <h1>{list.list_name}</h1>
            <hr className="hr" />
            {list.products.map((product)=>{
                return(
                    <div className="todoProduct" key={product.products_id}>
                        <div className="doneOrNot">
                            <img id="notDoneIcon" src={notDoneIcon} alt="Ikke-færdig ikon" />
                            <p>{product.name}</p>
                        </div>
                        <img id="editIcon" src={editIcon} alt="Redigér ikon" />
                    </div>
                )

            })}
            <div className="addSection">
                <img src={addIcon} alt="Tilføj opgave ikon" />
                <p>Tilføj et punkt</p>
            </div>
        </div>
    )
}

export default List