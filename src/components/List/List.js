import React, {useState, useEffect} from "react";
import "./List.css";
import back from "../../assets/img/back.svg";
import share from "../../assets/img/share.svg";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const List = () =>{
    const {id}=useParams()

    const [list, setList] = useState({lists_id: id, name: ''})
    
    useEffect(() => {
        axios(`http://localhost:8000/server/lists/read.php?lists_id=${id}`)
          .then((result) => {
            console.log(result.data[0]);
            setList(result.data[0])
          })
          .catch((error) => {
            console.log(error);
          });
      }, []);

    return(
        <div className="listSection">
            <div className="firstSection">
                <Link to={'/'} className="backSection">
                    <img id="back" src={back} alt="Tilbage ikon" />
                    <p>Tilbage</p>
                </Link>
                <div className="shareSection">
                    <p>Del liste</p>
                    <img id="share" src={share} alt="Del liste ikon" />
                </div>
            </div>
            <hr className="hr" />
            <h1>{list.name}</h1>
            <hr className="hr" />
        </div>
    )
}

export default List