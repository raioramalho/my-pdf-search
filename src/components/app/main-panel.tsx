import { DropzoneOptions, useDropzone } from "react-dropzone";
import { invoke } from "@tauri-apps/api";
import { File } from "buffer";
import { ask  } from "@tauri-apps/api/dialog";
import { useState } from "react";
// import SaveFileService from "@/cases/save-file.service";
import { sendNotification } from "@tauri-apps/api/notification";
import { emit, listen } from "@tauri-apps/api/event";

export default function MainPanel() {
  // Instância do serviço para salvar arquivos
  // const saveFileService = new SaveFileService('./');

  // Estado para armazenar o arquivo atual e seu nome
  const [currentFile, setCurrentFile] = useState<File | any>(null);
  const [currentFileName, setCurrentFileName] = useState<string>("");

  async function salvarArquivoPDF(nomeArquivo: string, conteudo: Promise<ArrayBuffer>): Promise<void> {
    let buf = await conteudo;
    invoke("log", {log: "chegou aqui!"})
    try {
      await invoke("salvar_arquivo_pdf", { nome_arquivo: nomeArquivo, conteudo: Array.from(new Uint8Array(buf)) });
      invoke("log", {log: "Arquivo salvo com sucesso."});
    } catch (error) {
      console.error("Erro ao salvar o arquivo PDF:", error);
    }
  }

  // Função executada quando um arquivo é solto na área de drop
  const onDrop: DropzoneOptions["onDrop"] = (acceptedFiles) => {
    // Verifica se algum arquivo foi aceito
    const acceptedFile = acceptedFiles[0];
    if (!acceptedFile) return;

    // Exibe uma caixa de diálogo para confirmar o carregamento do arquivo
    ask("Deseja mesmo carregar este arquivo?", "MyPdfSearch")
      .then((res: boolean) => {
        invoke("log", { log: `Dialog response: ${String(res)}` });

        // Se o usuário confirmou o carregamento do arquivo
        if (!res) return;

        // Verifica se o arquivo é do tipo PDF
        if (acceptedFile.type !== "application/pdf") {
          // Notifica o usuário sobre o tipo de arquivo não aceito
          sendNotification({
            title: `Tipo de arquivo não aceito.`,
            body: acceptedFile.name,
            sound: "default"
          });
          console.log(`Tipo não aceitado.`);
          return;
        }

        // Emite um evento para sinalizar que o processo de carregamento do arquivo começou
        emit("set_processo_event", "carregado");
        invoke("log", {
          log: `File drop detected - fileName: ${acceptedFile.name} | fileSize: ${acceptedFile.size}`,
        });

        // Atualiza o estado com o arquivo selecionado e seu nome
        setCurrentFile(acceptedFile);
        setCurrentFileName(acceptedFile.name);

        // Salva o arquivo
        let buf:any = acceptedFile.arrayBuffer;
        let  save = salvarArquivoPDF(acceptedFile.name, buf);
        console.log(save);
        
      })
      .catch((err) => {
        invoke("log", { log: `Dialog error: ${String(err)}` });
      });
  };

  // Escuta eventos para remover ou processar arquivos
  listen("remove_file_event", () => {
    setCurrentFile(null);
    setCurrentFileName("");
  });

  listen("processar_file_event", () => {
    if (currentFileName === currentFile?.name) {
      console.log(`Processar arquivo selecionado:`, currentFile);
    }
  });

  // Configurações do Dropzone
  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    multiple: false,
  };

  // Hook useDropzone para gerenciar a área de drop
  const { getRootProps, getInputProps } = useDropzone(dropzoneOptions);

  // Renderiza o componente
  return (
    <div className="flex flex-col justify-center items-center mr-4 ml-4 rounded">
      <div
        {...getRootProps()}
        className={`border border-dashed hover:border-neutral-700 rounded-md w-full h-[400px] flex flex-col justify-center items-center text-center`}
      >
        <input
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
