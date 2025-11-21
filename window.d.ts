import { FileAPI } from "src/preloads/fileInterface";

declare global {
  interface Window {
    FileService: FileAPI
  }
}