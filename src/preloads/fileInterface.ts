export interface FileAPI {
  folderSelect: FolderSelectAPI;
  folderList: FolderListAPI;
  fileCopy: FileCopyAPI;
  fileSelect: FileSelectAPI;
  fileImport: FileImportAPI;
  fileExport: FileExportAPI;
}

export type File = {
  filePath: string;
  children?: File[];
}

export type FolderSelectAPI = () => Promise<string>;
export type FolderListAPI = (path: string, recursive?: boolean) => Promise<File[]>;
export type FileCopyAPI = (source: string, target: string) => Promise<void>;
export type FileSelectAPI = () => Promise<string>;
export type FileImportAPI = (filename: string) => Promise<unknown>;
export type FileExportAPI = (filename: string, data: unknown) => Promise<void>;