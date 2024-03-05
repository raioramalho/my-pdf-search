import { useEffect, useState } from "react";
import "./App.css";
import MainPanel from "./components/app/main-panel";
import NavBar from "./components/app/nav-bar";
import { Button } from "./components/ui/button";
import { emit, listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api";
import Spinner from "./components/ui/loading";

function App() {
  const [processo, setProcesso] = useState("parado");
  const [filePath, setFilePath] = useState("");
  const [fileStatus, setFileStatus] = useState(false);
  const [fileName, setFileName] = useState("");

  invoke("criar_arquivo_python", {});

  listen("arquivo_processado", (event: any)=> {
    console.log(`Arquivo processado:`, event);
    setFileName("file.docx");
    setFilePath(`${filePath}/file.docx`);
    setProcesso("processado");
  })

  listen("file_name_event", (event: any) => {
    setFileName(`my-pdf-search-${event.payload}`);
  });

  listen("set_processo_event", (event: any) => {
    setProcesso(event.payload);
  });

  listen("saved_file_event", (event: any) => {
    console.log(`event: saved_file_event: ${JSON.stringify(event)}`);
    setFilePath(event.payload);
  });

  useEffect(() => {
    if (processo === "carregado" || "processado" || "processando") {
      setFileStatus(true);
    }
    if (processo === "parado") {
      setFileStatus(false);
    }
  }, [processo]);

  useEffect(() => {
    if (fileStatus) {
      let input: any = window.document.getElementById("input-file");
      input.disabled = true;
    } else {
      let input: any = window.document.getElementById("input-file");
      input.disabled = false;
    }
  }, [fileStatus]);

  async function funcProcessarArquivo() {
    await invoke("process_file", { path: filePath, file: fileName }).then((res) => {
      console.log(`process_file: ${res}`);
    });  
  }

  async function handleProcessarSalvar(e: any) {
    e.preventDefault();
    if (processo === "carregado") {
      setProcesso("processando");
      funcProcessarArquivo();
    }
    if (processo === "processado") {
      await invoke("log", { log: `Clicou em Salvar!` });
    }
  }

  async function handleCarregarRemover(e: any) {
    e.preventDefault();
    invoke("log", { log: `Clicou em Carregar/Remover!` });
    if (processo === "carregado" || "processado") {
      setProcesso("parado");
      setFilePath("");
      setFileStatus(false);
      setFileName("");
      emit("remove_file_event", "parado");
      if(processo === "carregado") {
        window.location.reload();
      }
    }
    if (processo === "parado") {
      setProcesso("parado");
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
          variant={
            processo === "carregado" ? "destructive" : "secondary" ||
            processo === "processando" ? "secondary" : "secondary"
          }
          onClick={handleCarregarRemover}
        >
          { processo != "processando" ? "Carregar/Remover" : <Spinner/> }
        </Button>
        <Button
          className="w-full cursor-pointer"
          disabled={fileStatus ? false : true}
          onClick={handleProcessarSalvar}
        >
          {processo === "processado" ? "Salvar" : "Processar"}
        </Button>
      </div>
    </main>
  );
}

export default App;
