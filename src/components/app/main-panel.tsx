import { DropzoneOptions, useDropzone } from "react-dropzone";
import { invoke } from "@tauri-apps/api";
import { File } from "buffer";
import { Input } from "../ui/input";
import { ask } from "@tauri-apps/api/dialog";
import { useState } from "react";
import { emit, listen } from "@tauri-apps/api/event";
import { sendNotification } from "@tauri-apps/api/notification";

export default function MainPanel() {
  const [currentFile, setCurrentFile] = useState<File | null>();
  const [currentFileName, setCurrentFileName] = useState("");

  listen("remove_file_event", (event: any) => {
    invoke("log", {log: `event: remove_file_event: ${event.payload}`})
    setCurrentFile(null);
    setCurrentFileName("");
  })

  const onDrop: any = (acceptedFiles: File[], event: any) => {
    ask("Deseja mesmo carregar este arquivo?", "MyPdfSearch")
      .then((res: boolean) => {
        invoke("log", { log: `Dialog response: ${String(res)}` });
        if (res) {
          let acceptedFile = acceptedFiles[0];
          if (acceptedFile.type != "application/pdf") {
            sendNotification({
              title: `Tipo de arquivo não aceito.`,
              body: event.payload,
              sound: "default"
            })
            console.log(`Tipo não aceitado.`);
            return;
          } else {
            emit("set_processo_event", "carregado");
            invoke("log", {
              log: `File drop detected - fileName: ${acceptedFile?.name} | fileSize: ${acceptedFile?.size}`,
            });
            invoke("set_file_name", { name: acceptedFiles[0].name });
            setCurrentFile(acceptedFile);
            setCurrentFileName(acceptedFile.name);
            console.log(`Event:`, event);
            console.log(`CurrentFile:`, acceptedFile);
          }
        }
        return;
      })
      .catch((err) => {
        invoke("log", { log: `Dialog error: ${String(err)}` });
      });
  };

  // Opções do Dropzone
  const dropzoneOptions: DropzoneOptions = {
    onDragOver: () => {
      invoke("log", { log: `TestDragOver!` });
    },
    onDragLeave: () => {
      invoke("log", { log: `TestDragLeave!` });
    },
    onDrop,
    onDropAccepted: () => {
      invoke("log", { log: `TestDropAceppted!` });
    },
    onDropRejected: () => {
      invoke("log", { log: `TestDropRejected!` });
    },
    // accept: ['application/json'] ,
    multiple: false, // Defina como true se você quiser permitir a seleção de múltiplos arquivos
  };

  // UseDropzone Hook
  const { getRootProps, getInputProps } = useDropzone(dropzoneOptions);

  listen("processar_file_event", () => {
    if(currentFileName === currentFile?.name) {
      console.log(`Processar arquivo selecionado:`, currentFile);
      invoke("log", {log: `Processando: ${currentFile.name}`})
    }
  })

  return (
    <div className="flex flex-col justify-center items-center mr-4 ml-4 rounded">
      <div
      // aria-disabled={currentFile === null ? false : true}
        {...getRootProps()}
        className={`border border-dashed hover:border-neutral-700 rounded-md w-full h-[400px] flex flex-col justify-center items-center text-center`}
      >
        <Input
        className=""
        id="input-file"
          {...getInputProps()}
          aria-description="Deposite seu pdf aqui.."
        />
        <p className="text-sm opacity-50">
          {currentFileName || "Deposite seu pdf aqui..."}
        </p>
      </div>
    </div>
  );
}
