import fs from "fs";
import path from "path";
import { File, FileAPI } from "./fileInterface";
import { ipcRenderer } from "electron";

const FileService: FileAPI = {
  /**
   * 选择文件夹
   * @returns 文件夹路径
   */
  folderSelect: function () {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke("folder-select").then(({ success, folderPath }) => {
        if (success) {
          resolve(folderPath);
        } else {
          reject();
        }
      })
    })
  },
  /**
   * 列出文件夹内容
   * @param dir 文件夹路径
   * @param recursive 是否递归查询
   * @returns 文件列表
   */
  folderList: function (dir: string, recursive?: boolean) {
    return new Promise((resolve, reject) => {
      fs.readdir(dir, { withFileTypes: true, recursive }, (err, data) => {
        if (err) {
          reject(err)
        } else {
          const handleFiles = (dir: string): File[] => {
            const files: File[] = [];
            for (const file of data) {
              if (file.parentPath === dir) {
                if (file.isDirectory()) {
                  files.push({
                    filePath: file.name,
                    children: handleFiles(dir + path.sep + file.name),
                  });
                } else {
                  files.push({
                    filePath: file.name
                  });
                }
              }
            }
            return files;
          }
          resolve(handleFiles(dir));
        }
      })
    })
  },
  /**
   * 拷贝文件
   * @param source 源路径
   * @param target 目标路径
   * @returns 
   */
  fileCopy: function(source: string, target: string) {
    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(source)) {
          return reject("源文件不存在");
        }
        if (!fs.existsSync(path.dirname(target))) {
          fs.mkdirSync(path.dirname(target), { recursive: true });
        }
        fs.copyFileSync(source, target);
        resolve();
      } catch (e) {
        reject(e);
      }
    })
  },
  /**
   * 选择文件
   * @returns 文件路径
   */
  fileSelect: function () {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke("file-select").then(({ success, filePath }) => {
        if (success) {
          resolve(filePath);
        } else {
          reject();
        }
      })
    })
  },
  /**
   * 导入文件
   * @param filename 文件路径
   * @returns 文件内容
   */
  fileImport: function(filename: string) {
    return new Promise((resolve, reject) => {
      try {
        ipcRenderer.invoke("file-import", { filename }).then(({ success, file }) => {
        if (success) {
          resolve(file);
        } else {
          reject();
        }
      })
      } catch (e) {
        reject(e)
      }
    })
  },
  /**
   * 导出文件
   * @param filename 文件路径
   * @param data 文件内容
   * @returns 
   */
  fileExport: function(filename: string, data: unknown) {
    return new Promise((resolve, reject) => {
      try {
        ipcRenderer.invoke("file-export", { filename, data }).then(({ success }) => {
        if (success) {
          resolve();
        } else {
          reject();
        }
      })
      } catch (e) {
        reject(e)
      }
    })
  }
}

export default FileService;