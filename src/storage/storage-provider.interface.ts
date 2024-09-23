export interface StorageProvider {
  create(
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string,
  ): Promise<string>;
  getFileUrl(fileName: string): Promise<string>;
}
