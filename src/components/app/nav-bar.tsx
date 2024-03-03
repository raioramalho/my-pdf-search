import { useState } from "react";
import { ThemeToggle } from "../ui-theme/theme-toggle";
import { listen } from "@tauri-apps/api/event";
import { sendNotification } from "@tauri-apps/api/notification";
import { invoke } from "@tauri-apps/api";

export default function NavBar() {
  const [fileName, setFileName] = useState("");

  async function listenEvents() {
    await listen("file_name_event", (event: any) => {
      setFileName(event.payload);
      sendNotification({
        title: `Novo arquivo carregado.`,
        body: event.payload,
        sound: "default"
      })
  });

  await listen("remove_file_event", (event: any) => {
    invoke("log", {log: `event: remove_file_event: ${event.payload}`})
    setFileName("");
  })    
  }

  listenEvents()
  
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
