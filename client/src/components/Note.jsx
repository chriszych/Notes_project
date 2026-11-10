import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../context/userContext";
import { updateNote } from "../../../server/controllers/noteApiController";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import CircularProgress from "@mui/material/CircularProgress";

function Note(props) {
  const { user } = useContext(UserContext);
  const queryClient = useQueryClient();

  const [isEdited, setIsEdited] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [editedTitle, setEditedTitle] = useState(props.title);
  const [editedContent, setEditedContent] = useState(props.content);

  const { mutate: onDelete, isPending: isDeleting } = useMutation({
    mutationFn: async (noteId) => {
      const response = await axios.delete(`/api/notes/${noteId}`, {
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Error during deleting note from server"
        );
      }
      return noteId;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["notes", user?.id],
      }),
    onError: (error) => {
      setErrorMessage(error?.message || "Error during note deletion");
    },
  });

  const { mutate: onUpdate, isPending: isUpdating } = useMutation({
    mutationFn: async ({ noteId, updatedNote }) => {
      const response = await axios.put(`/api/notes/${noteId}`, updatedNote, {
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Error during updating note on server"
        );
      }

      return response.data.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["notes", user?.id],
      }),
    onError: (error) => {
      setErrorMessage(error?.message || "Error during note update");
    },
  });

  const isSubmitting = isUpdating || isDeleting;

  async function handleDeleteClick() {
    if (!window.confirm("Are you sure to delete this note?")) return;
    setErrorMessage("");
    deleteNote(props.id);
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
    setErrorMessage("");
    updateNote({
      noteId: props.id,
      updatedNote: {
        title: editedTitle.trim(),
        content: editedContent.trim(),
      },
    });
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
