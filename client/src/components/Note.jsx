import React, {useState} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

function Note(props) {

const [isEdited, setIsEdited] = useState(false);

const [editedTitle, setEditedTitle] = useState(props.title);
  const [editedContent, setEditedContent] = useState(props.content);

  function deleteClick() {
    props.onDelete(props.id);
  }
  function editClick() {
    setIsEdited(true);
    props.onEdit(props.id);
  }
    function saveClick() {
      setIsEdited(false);
    props.onSave(props.id);
  }

  return (
    <div className="note">
    
    {!isEdited ? (
      <>
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      </>
    ) : (
      <>
      <input 
        type="text"
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        className="edit-title-input"
      ></input>
      <textarea 
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        rows="4"
        className="edit-content-textarea"
        ></textarea>
      </>
    )}


      <button onClick={deleteClick}>
        <DeleteIcon />
      </button>
      {!isEdited ? (
            <button onClick={editClick}>
        <EditIcon />
      </button>) : (
            <button onClick={saveClick}>
        <SaveIcon />
      </button>
      )}

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
