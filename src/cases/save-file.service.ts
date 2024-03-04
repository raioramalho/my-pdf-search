import fs from 'fs';
import path from 'path';

export default class SaveFileService {
    constructor(private uploadPath: string) {}

    // Método para salvar o arquivo
    async salvarArquivo(nomeArquivo: string, conteudo: ArrayBuffer): Promise<void> {
        const caminhoArquivo = path.join(this.uploadPath, nomeArquivo);
        const buffer = Buffer.from(conteudo);
        await fs.promises.writeFile(caminhoArquivo, buffer);
    }

    // Método para verificar se o arquivo existe
    async verificarExistencia(nomeArquivo: string): Promise<boolean> {
        const caminhoArquivo = path.join(this.uploadPath, nomeArquivo);
        try {
            await fs.promises.access(caminhoArquivo);
            return true;
        } catch (error) {
            return false;
        }
    }

    // Método para obter o arquivo
    async obterArquivo(nomeArquivo: string): Promise<ArrayBuffer | null> {
        const caminhoArquivo = path.join(this.uploadPath, nomeArquivo);
        try {
            const conteudo = await fs.promises.readFile(caminhoArquivo);
            return conteudo.buffer;
        } catch (error) {
            return null;
        }
    }
}
