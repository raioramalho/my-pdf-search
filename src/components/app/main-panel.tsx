import { useState } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { invoke } from "@tauri-apps/api";
import { File } from "buffer";

export default function MainPanel() {
  const [file, setFile] = useState<File>();

  const onDrop: any = (acceptedFiles: File[]) => {
    if(acceptedFiles.length >0) {
      setFile(acceptedFiles[0])
      invoke("log", { log: `File drop detected - fileName: ${file?.name} | fileSize: ${file?.size}`});
      invoke("file_dropped", { file_name: file?.name })
    }
  };

  // Opções do Dropzone
  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    // accept: "*", 
    multiple: false, // Defina como true se você quiser permitir a seleção de múltiplos arquivos
  };

  // UseDropzone Hook
  const { getRootProps, getInputProps } = useDropzone(dropzoneOptions);

  return (
    <div className="flex flex-col justify-center items-center mr-4 ml-4 rounded">
      <div {...getRootProps()} className="border rounded-md w-full h-[465px] flex flex-col justify-center items-center text-center">
        <input {...getInputProps()} />
        <p>Solte seu PDF aqui...</p>
      </div>
    </div>
  );
}
