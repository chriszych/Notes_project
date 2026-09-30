import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import CircularProgress from "@mui/material/CircularProgress";

function Note(props) {
  const [isEdited, setIsEdited] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [editedTitle, setEditedTitle] = useState(props.title);
  const [editedContent, setEditedContent] = useState(props.content);

  async function handleDeleteClick() {
    if (!window.confirm("Are you sure to delete this note?")) return;
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      await props.onDelete(props.id);
    } catch (err) {
      console.error("Error during note deletion:", err);
      setErrorMessage(err?.message || "Error during note deletion");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEditClick() {
    setErrorMessage("");
    setIsEdited(true);
  }

  async function handleSaveClick() {
    if (!editedTitle.trim() && !editedContent.trim()) {
      setErrorMessage("Note cannot be empty.");
      return;
    }
    try {
      setIsEdited(false);
      setErrorMessage("");
      await props.onSave({
        title: editedTitle.trim(),
        content: editedContent.trim(),
      });
      setIsEdited(false);
    } catch (err) {
      console.error("Error during note saving:", err);
      setErrorMessage(err?.message || "Error during note saving");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancelClick() {
    setIsEdited(false);
    setErrorMessage("");
    setEditedTitle(props.title);
    setEditedContent(props.content);
  }

  return (
    <div className="note">
      {errorMessage && (
        <div style={{ color: "red", fontSize: "0.8rem", marginBottom: "8px" }}>
          {errorMessage}
        </div>
      )}
      {isEdited ? (
        <>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="edit-title-input"
            disabled={isSubmitting}
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            className="edit-content-textarea"
            disabled={isSubmitting}
          />
        </>
      ) : (
        <>
          <h1>{props.title}</h1>
          <p>{props.content}</p>
        </>
      )}

      <div className="note-actions">
        {isSubmitting ? (
          <CircularProgress size={24} style={{ margin: "6px" }} />
        ) : isEdited ? (
          <>
            <button
              onClick={handleSaveClick}
              title="Save"
              disabled={isSubmitting}
            >
              <SaveIcon />
            </button>
            <button
              onClick={handleCancelClick}
              title="Cancel"
              disabled={isSubmitting}
            >
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
        <span>Edited: {props.updatedAt}</span>
        <br />
        <span>Added: {props.createdAt}</span>
      </div>
    </div>
  );
}

export default Note;
