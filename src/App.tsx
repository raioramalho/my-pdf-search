import { useEffect, useState } from "react";
import "./App.css";
import MainPanel from "./components/app/main-panel";
import NavBar from "./components/app/nav-bar";
import { Button } from "./components/ui/button";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api";

function App() {
  const [processo, setProcesso] = useState("parado");
  const [fileStatus, setFileStatus] = useState(false);

  listen("set_processo_event", (event: any) => {
    setProcesso(event.payload);
  })

  useEffect(() => {
    if(processo === "processado") {
      setFileStatus(true);
    }
    if(processo === "processando") {
      setFileStatus(false);
    }
    if(processo === "parado") {
      setFileStatus(false);
    }
  }, [processo])

  return (
    <main id="main" className="flex flex-col gap-2">
      <NavBar />
      <MainPanel />
      <div className="p-2 m-4 border rounded h-[60px] flex flex-row justify-around items-center gap-2 hover:border-neutral-700">
        <Button
          className="w-full"
          variant={"secondary"}
          onClick={(e) => {
            e.preventDefault()
            invoke("log", {log:`Clicou em processar!`})
          }}
        >
          {processo === "parado" ? "Carregar" : "loading.." || processo === "processado" ? "Remover" : "loading.."}
        </Button>
        <Button
          className="w-full"
          disabled={!fileStatus ? true : false}
          onClick={(e) => {
            e.preventDefault()
            invoke("log", {log:`Clicou em salvar!`})
          }}
        >
          Salvar
        </Button>
      </div>
    </main>
  );
}

export default App;
