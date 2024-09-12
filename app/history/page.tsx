// respec-app\app\history\page.tsx

"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/client";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      const { data, error } = await supabase.from("notes").select("id, title");
      if (error) {
        setError(error.message);
      } else {
        setNotes(data);
      }
    };

    fetchNotes();
  }, []);

  if (error) {
    return <div>Error fetching notes: {error}</div>;
  }

  return (
    <div>
      <h1>Notes</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note) => (
            <tr key={note.id}>
              <td>{note.id}</td>
              <td>{note.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
