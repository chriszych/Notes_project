import React, { useContext } from "react";
import Note from "../components/Note";
import CreateArea from "../components/CreateArea";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "../context/userContext";

function Notes() {
  const { user } = useContext(UserContext);

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

  if (isPending) {
    return <div className="text-center mt-5">Loading notes...</div>;
  }

  return (
    <div>
      <CreateArea />
      <div className="notes-container">
        {notes.length === 0 ? (
          <p className="empty-info">You don't have your notes yet.</p>
        ) : (
          notes.map((noteItem, index) => (
            <Note
              key={noteItem.id || index}
              title={noteItem.title}
              id={noteItem.id}
              content={noteItem.content || noteItem.text}
              createdAt={new Date(noteItem.createdAt).toLocaleString("pl-PL")}
              updatedAt={new Date(noteItem.updatedAt).toLocaleString("pl-PL")}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Notes;
