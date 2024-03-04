import { useEffect, useState } from "react";
import "./App.css";
import MainPanel from "./components/app/main-panel";
import NavBar from "./components/app/nav-bar";
import { Button } from "./components/ui/button";
import { emit, listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api";

function App() {
  const [processo, setProcesso] = useState("parado");
  const [fileStatus, setFileStatus] = useState(false);

  listen("set_processo_event", (event: any) => {
    setProcesso(event.payload);
  })

  useEffect(() => {
    if(processo === "carregado" || "processado" || "processando") {
      setFileStatus(true);
    }
    if(processo === "parado") {
      setFileStatus(false);
    }
  }, [processo])

  useEffect(() => {
    if(fileStatus) {
      let input: any = window.document.getElementById("input-file");
      input.disabled = true;
    }else{
      let input:any = window.document.getElementById("input-file");
      input.disabled = false;
    }
  },[fileStatus])

  function handleProcessarSalvar(e:any) {
    e.preventDefault()
    if(processo === "carregado") {
      invoke("log", {log:`Clicou em Processar/Salvar!`})
      emit("processar_file_event", {});
    }
    if(processo === "processado") {
      invoke("log", {log:`Clicou em Salvar!`})
    }
  }

  function handleCarregarRemover(e:any) {
    e.preventDefault()
    invoke("log", {log:`Clicou em Carregar/Remover!`})
    if(processo === "carregado" || "processado"){
      setProcesso("parado")
      emit("remove_file_event", processo)
    }
    if(processo === "parado") {
      setProcesso("parado")
      window.document.getElementById("input-file")?.click();
    }
    
  }

  return (
    <main id="main" className="flex flex-col gap-2">
      <NavBar />
      <MainPanel />
      <div className="p-2 m-4 border rounded h-[60px] flex flex-row justify-around items-center gap-2 hover:border-neutral-700">
        <Button
          className="w-full cursor-pointer"
          variant={processo === "carregado" ? "destructive" : "secondary"}
          onClick={handleCarregarRemover}
        >
          {processo === "carregado" ? "Remover" : "Carregar"}
        </Button>
        <Button
          className="w-full cursor-pointer"
          disabled={!fileStatus ? true : false}
          onClick={handleProcessarSalvar}
        >
          {processo === "processado" ? "Salvar" : "Processar"}
        </Button>
      </div>
    </main>
  );
}

export default App;
