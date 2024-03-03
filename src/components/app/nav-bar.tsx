import { useState } from "react";
import { ThemeToggle } from "../ui-theme/theme-toggle";
import { Event, listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api";

export default function NavBar() {
  const [fileName, setFileName] = useState("");

  listen("file_name_event", (event: Event<any>) => {
      invoke("log", { log: `event: "file_name_event"` });
      setFileName(event.payload);
  });
  
  return (
    <div
      id="navbar"
      className="p-2 mr-4 ml-4 mt-4 flex flex-row justify-between items-center border rounded-md text-sm"
    >
      <span>MyPdfSearch</span>
      <span>{fileName ? `${fileName}` : ``}</span>
      <ThemeToggle />
    </div>
  );
}
