import { useEffect, useState } from "react";
import "./App.css";
import MainPanel from "./components/app/main-panel";
import NavBar from "./components/app/nav-bar";
import { Button } from "./components/ui/button";
import { emit, listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api";
import { sendNotification } from "@tauri-apps/api/notification";

function App() {
  const [processo, setProcesso] = useState("parado");
  const [filePath, setFilePath] = useState("");
  const [fileStatus, setFileStatus] = useState(false);
  const [fileName, setFileName] = useState("");

  invoke("criar_arquivo_python", {});

  listen("file_name_event", (event: any) => {
    setFileName(`my-pdf-search-${event.payload}`);
    sendNotification({
      title: `Novo arquivo carregado.`,
      body: fileName,
      sound: "default",
    });
  });

  listen("set_processo_event", (event: any) => {
    setProcesso(event.payload);
  });

  listen("saved_file_event", (event: any) => {
    console.log(`event: saved_file_event: ${JSON.stringify(event)}`);
    setFilePath(event.payload);
  })

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

  async function handleProcessarSalvar(e: any) {
    e.preventDefault();
    if (processo === "carregado") {
      await invoke("process_file", { path: filePath, file: fileName } )
    }
    if (processo === "processado") {
      await invoke("log", { log: `Clicou em Salvar!` });
    }
  }

  function handleCarregarRemover(e: any) {
    e.preventDefault();
    invoke("log", { log: `Clicou em Carregar/Remover!` });
    if (processo === "carregado" || "processado") {
      setProcesso("parado");
      emit("remove_file_event", processo);
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
          variant={processo === "carregado" ? "destructive" : "secondary"}
          onClick={handleCarregarRemover}
        >
          Carregar/Remover
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
