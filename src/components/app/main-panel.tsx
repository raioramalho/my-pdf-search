import { DropzoneOptions, useDropzone } from "react-dropzone";
import { invoke } from "@tauri-apps/api";
import { File } from "buffer";
import { Input } from "../ui/input";
import { FileDropEvent } from "@tauri-apps/api/window";

export default function MainPanel() {
  const onDrop: any = (acceptedFiles: File[], event: FileDropEvent) => {
    let acceptedFile = acceptedFiles[0];
    invoke("log", {log: `event: ${event}`})
    invoke("log", {
      log: `File drop detected - fileName: ${acceptedFile?.name} | fileSize: ${acceptedFile?.size}`,
    });
    invoke("set_file_name", { name: acceptedFiles[0].name });
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
        className="border border-dashed hover:border-neutral-700 rounded-md w-full h-[400px] flex flex-col justify-center items-center text-center"
      >
        <Input {...getInputProps()} 
        aria-description="Deposite seu pdf aqui.."
        />
        <p className="text-sm opacity-50">
          Deposite seu pdf aqui...
        </p>
      </div>
    </div>
  );
}
