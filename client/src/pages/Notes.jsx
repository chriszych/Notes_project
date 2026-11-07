import React, { useContext } from "react";
import Note from "../components/Note";
import CreateArea from "../components/CreateArea";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../context/userContext";

function Notes() {
  const { user } = useContext(UserContext);
  const queryClient = useQueryClient();

  const {
    data: notes = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["notes", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const response = await axios.get("/api/notes", {
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Error during fetching notes from server"
        );
      }

      if (!Array.isArray(response.data.data)) {
        throw new Error("Received invalid data format from server");
      }

      return response.data.data || [];
    },
  });

    const AddNoteMutation = useMutation({
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
      // onSuccess: (addedNote) => {
      //   setNotes((prevNotes) => [addedNote, ...prevNotes]);
      onSuccess: () => queryClient.invalidateQueries({
        queryKey: ["notes", user?.id],
      }),
      //},
      onError: (err) => {
        if (err.response) {
          console.error("Server error during adding note:", err.response);
          alert(
            err.response.data?.message || "Server error during adding note"
          );
        } else {
          console.error("Adding note error:", err);
          alert(err.message || "Problem with connection or adding note.");
        }
      },
    });

    const DeleteNoteMutation = useMutation({
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
      onSuccess: () => queryClient.invalidateQueries({
        queryKey: ["notes", user?.id],
      }),
      onError: (err) => {
        if (err.response) {
          console.error("Server error during deleting note:", err.response);
          alert(
            err.response.data?.message || "Server error during deleting note"
          );
        } else {
          console.error("Deleting note error:", err);
          alert(err.message || "Problem with connection or deleting note.");
        }
      },

    });

    const UpdateNoteMutation = useMutation({
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
      onSuccess: () => queryClient.invalidateQueries({
        queryKey: ["notes", user?.id],
      }),
      onError: (err) => {
        if (err.response) {
          console.error("Server error during updating note:", err.response);
          alert(
            err.response.data?.message || "Server error during updating note"
          );
        } else {
          console.error("Updating note error:", err);
          alert(err.message || "Problem with connection or updating note.");
        }
      },
    });

  async function addNote(newNote) {
    AddNoteMutation.mutate(newNote);
  }

  async function deleteNote(noteId) {
    if (!window.confirm("Are you sure to delete this note ?")) return;
    DeleteNoteMutation.mutate(noteId);
  }

  async function saveNote(noteId, updatedNote) {
    UpdateNoteMutation.mutate({ noteId, updatedNote });
    // try {
    //   const response = await axios.put(`/api/notes/${noteId}`, updatedNote, {
    //     withCredentials: true,
    //   });

    //   if (!response.data.success) {
    //     throw new Error(
    //       response.data.message || "Error during modyfing note on server"
    //     );
    //   }

    //   setNotes((prev) => [
    //     response.data.data,
    //     ...prev.filter((note) => note.id !== noteId),
    //   ]);
    // } catch (err) {
    //   if (err.response) {
    //     console.error("Server error during saving note:", err.response);
    //     alert(err.response.data?.message || "Server error during saving note");
    //   } else {
    //     console.error("Saving note error:", err);
    //     alert(err.message || "Problem with connection or saving note.");
    //   }
    // }
  }

  // if (loading) {
  if (isPending) {
    return <div className="text-center mt-5">Loading notes...</div>;
  }

  return (
    <div>
      <CreateArea onAdd={addNote} />

      <div className="notes-container">
        {notes.length === 0 ? (
          <p className="empty-info">You don't have your notes yet.</p>
        ) : (
          notes.map((noteItem, index) => (
            <Note
              key={noteItem.id || index}
              title={noteItem.title}
              content={noteItem.content || noteItem.text}
              createdAt={new Date(noteItem.createdAt).toLocaleString("pl-PL")}
              updatedAt={new Date(noteItem.updatedAt).toLocaleString("pl-PL")}
              onDelete={() => deleteNote(noteItem.id)}
              onSave={(updatedNote) => saveNote(noteItem.id, updatedNote)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Notes;
