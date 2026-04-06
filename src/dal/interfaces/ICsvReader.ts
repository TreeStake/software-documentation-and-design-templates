export interface ICsvReader {
    readFile(filePath: string): Promise<any[]>;
}