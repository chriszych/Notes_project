import React, {useState} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from '@mui/icons-material/Cancel';

function Note(props) {

const [isEdited, setIsEdited] = useState(false);

const [editedTitle, setEditedTitle] = useState(props.title);
  const [editedContent, setEditedContent] = useState(props.content);

  function handleDeleteClick() {
    props.onDelete(props.id);
  }
  function handleEditClick() {
    setIsEdited(true);
    //props.onEdit(props.id);
  }
    function handleSaveClick() {
      setIsEdited(false);
      //console.log(editedTitle, editedContent);
    props.onSave({"title": editedTitle, "content": editedContent});
  }

  function handleCancelClick(){
    setIsEdited(false);
    setEditedTitle(props.title);
    setEditedContent(props.content);
  }

  return (
  <div className="note">
  {isEdited ? (
    <>
      <input
        type="text"
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        className="edit-title-input"
      />
      <textarea
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        onInput={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = e.target.scrollHeight + "px";
        }}
        className="edit-content-textarea"
      />
    </>
  ) : (
    <>
      <h1>{props.title}</h1>
      <p>{props.content}</p>
    </>
  )}

  {/* Kontener utrzymujący ikonki w poziomie po lewej stronie */}
  <div className="note-actions">
    {isEdited ? (
      <>
        <button onClick={handleSaveClick} title="Save">
          <SaveIcon />
        </button>
        <button onClick={handleCancelClick} title="Cancel">
          <CancelIcon />
        </button>
      </>
    ) : (
      <>
        <button onClick={handleEditClick} title="Edit">
          <EditIcon />
        </button>
        <button onClick={handleDeleteClick} title="Delete">
          <DeleteIcon />
        </button>
      </>
    )}
  </div>

  <div className="dates">
    <span><i className="fas fa-history"></i> {props.updatedAt}</span>
    <br />
    <span><i className="far fa-clock"></i> {props.createdAt}</span>
  </div>
</div>
  );
}

export default Note;
