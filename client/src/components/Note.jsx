import React, {useState} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from '@mui/icons-material/Cancel';

function Note(props) {

const [isEdited, setIsEdited] = useState(false);

const [editedTitle, setEditedTitle] = useState(props.title);
  const [editedContent, setEditedContent] = useState(props.content);

  function deleteClick() {
    props.onDelete(props.id);
  }
  function editClick() {
    setIsEdited(true);
    //props.onEdit(props.id);
  }
    function saveClick() {
      setIsEdited(false);
      //console.log(editedTitle, editedContent);
    props.onSave({"title": editedTitle, "content": editedContent});
  }

  function cancelClick(){
    setIsEdited(false);
    setEditedTitle(props.title);
    setEditedContent(props.content);
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
        className="edit-content-textarea"
        ></textarea>
      </>
    )}

<div className="note-actions">
      {!isEdited ? (
            <button onClick={deleteClick}>
        <DeleteIcon />
         </button> ) : (

        <button onClick={cancelClick}>
        <CancelIcon />
         </button>
         )}

      {!isEdited ? (
            <button onClick={editClick}>
        <EditIcon />
      </button>) : (
            <button onClick={saveClick}>
        <SaveIcon />
      </button>
      )}
</div>
<br />
<br />
  <span className="dates"> Edited : {props.updatedAt}</span>
  {/* <span className="dates"><i className="fas fa-history"></i>Updated: {props.updatedAt}</span>
      
      <span className="dates" ><i className="far fa-clock"></i>Created: {props.createdAt}</span> */}
      <span className="dates" >Added : {props.createdAt}</span>
      {/* <p>{props.createdAt}</p> */}
      {/* <p>{props.updatedAt}</p> */}


    </div>
  );
}

export default Note;
