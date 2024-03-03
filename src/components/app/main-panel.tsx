import { DropzoneOptions, useDropzone } from "react-dropzone";
import { invoke } from "@tauri-apps/api";
import { File } from "buffer";
import { Input } from "../ui/input";

export default function MainPanel() {
  const onDrop: any = (acceptedFiles: File[]) => {
    let acceptedFile = acceptedFiles[0];
    invoke("log", {
      log: `File drop detected - fileName: ${acceptedFile?.name} | fileSize: ${acceptedFile?.size}`,
    });
    invoke("set_file_name", { file: acceptedFile?.name });
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
    // accept: [ 'document/*' ],
    multiple: false, // Defina como true se você quiser permitir a seleção de múltiplos arquivos
  };

  // UseDropzone Hook
  const { getRootProps, getInputProps } = useDropzone(dropzoneOptions);

  return (
    <div className="flex flex-col justify-center items-center mr-4 ml-4 rounded">
      <div
        {...getRootProps()}
        className="border rounded-md w-full h-[465px] flex flex-col justify-center items-center text-center"
      >
        <Input {...getInputProps()} />
        <p>Solte seu PDF aqui...</p>
      </div>
    </div>
  );
}
