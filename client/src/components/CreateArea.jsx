import React, { useState, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Fab, Zoom, CircularProgress } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../context/userContext";
import axios from "axios";

function CreateArea() {
  const { user } = useContext(UserContext);
  const [isExpanded, setExpanded] = useState(false);
  const queryClient = useQueryClient();
  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  const {
    mutate: addNote,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async (newNote) => {
      const response = await axios.post("/api/notes", newNote, {
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Error during adding note to server"
        );
      }

      return response.data.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["notes", user?.id],
      }),
    onError: (error) => {
      console.error("Error during adding note:", error);
      alert("Error during adding note: " + error.message);
    },
    onSettled: () => {
      setNote({
        title: "",
        content: "",
      });
      setExpanded(false);
    },
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value,
      };
    });
  }

  async function submitNote(event) {
    event.preventDefault();

    if (!note.title.trim() && !note.content.trim()) {
      return;
    }
    addNote({
      title: note.title.trim(),
      content: note.content.trim(),
    });
  }

  function expand() {
    setExpanded(true);
  }

  return (
    <div>
      <form className="create-note" onSubmit={submitNote}>
        {isExpanded && (
          <input
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Title"
            disabled={isPending}
          />
        )}

        <textarea
          name="content"
          onClick={expand}
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows={isExpanded ? 3 : 1}
          disabled={isPending}
        />
        <Zoom in={isExpanded}>
          <Fab type="submit" disabled={isPending}>
            {isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <AddIcon />
            )}
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
