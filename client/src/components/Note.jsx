import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

function Note(props) {
  function deleteClick() {
    props.onDelete(props.id);
  }
  function editClick() {
    props.onEdit(props.id);
  }
    function saveClick() {
    props.onSave(props.id);
  }

  return (
    <div className="note">
      <h1>{props.title}</h1>
      <p>{props.content}</p>


      <button onClick={deleteClick}>
        <DeleteIcon />
      </button>
            <button onClick={editClick}>
        <EditIcon />
      </button>
            <button onClick={saveClick}>
        <SaveIcon />
      </button>
<br />
<br />
  <span><i className="fas fa-history"></i> {props.updatedAt}</span>
      
<br />
      
      <span><i className="far fa-clock"></i> {props.createdAt}</span>
      {/* <p>{props.createdAt}</p> */}
      {/* <p>{props.updatedAt}</p> */}


    </div>
  );
}

export default Note;
