import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Input, message, Tree } from "antd";
import styles from "./index.module.less";
import { CheckCircleTwoTone, CloseCircleTwoTone, FileImageOutlined, LoadingOutlined, PauseCircleTwoTone } from "@ant-design/icons";

enum ImageFlattenStatus {
  SUCCESS,
  FAIL,
  UNKNOW,
  LOADING,
}

export default function ImageRename() {
  const [mapping, setMapping] = useState<string>();

  const [sourcePath, setSourcePath] = useState<string>();
  const [targetPath, setTargetPath] = useState<string>();
  
  const sourceRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const handleScroll = (event: Event) => {
    const scrollTop = (event.currentTarget as HTMLDivElement).scrollTop;
    console.log("handleScroll", scrollTop);
    sourceRef.current.scrollTop = scrollTop;
    targetRef.current.scrollTop = scrollTop;
  }
  useEffect(() => {
    if (sourceRef.current && targetRef.current) {
      sourceRef.current.addEventListener("scroll", handleScroll);
      targetRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (sourceRef.current && targetRef.current) {
        sourceRef.current.removeEventListener("scroll", handleScroll);
        targetRef.current.removeEventListener("scroll", handleScroll);
      } 
    }
  }, []);

  const [sourceFiles, setSourceFiles] = useState<{ name: string; files: { name: string }[] }[]>([]);
  const [targetFiles, setTargetFiles] = useState<{ name: string; files: { name: string; status: ImageFlattenStatus }[] }[]>([]);
  useEffect(() => {
    if (mapping && sourcePath) {
      window.FileService.folderList(sourcePath).then((files) => {
        const map = mapping.split("\n").map((item) => item.split("\t"));

        const nextSourceFiles: { name: string; files: { name: string }[] }[] = [];
        const nextTargetFiles: { name: string; files: { name: string; status: ImageFlattenStatus }[] }[] = [];

        for (const [from, to] of map) {
          const sourceFiles: { name: string }[] = [];
          const targetFiles: { name: string; status: ImageFlattenStatus }[] = [];
          files.forEach((file) => {
            if (file.filePath.match(new RegExp(`^${from}[ \\.\\-\\(\\[（【].*$`,'i'))) {
              sourceFiles.push({ name: file.filePath });
              targetFiles.push({ name: file.filePath.replace(new RegExp(`^${from}([ \\.\\-\\(\\[（【].*)$`,'i'), `${to}$1`), status: ImageFlattenStatus.UNKNOW });
            }
          })
          nextSourceFiles.push({ name: from, files: sourceFiles });
          nextTargetFiles.push({ name: to, files: targetFiles });
        }
        setSourceFiles(nextSourceFiles);
        setTargetFiles(nextTargetFiles);
      })
    }
  }, [mapping, sourcePath]);

  const handleExecute = async () => {
    if (sourcePath && targetPath && Array.isArray(sourceFiles) && Array.isArray(targetFiles) && sourceFiles.length === targetFiles.length) {
      for (let i = 0; i < sourceFiles.length; i++) {
        for (let j = 0; j < sourceFiles[i].files.length; j++) {
          setTargetFiles((targetFiles) => targetFiles.map((targetFile, index) => {
            if (index === i) {
              return {
                ...targetFile,
                files: targetFile.files.map((file, index) => {
                  if (index === j) {
                    return {
                      ...file,
                      status: ImageFlattenStatus.LOADING
                    }
                  } else {
                    return file;
                  }
                })
              }
            } else {
              return targetFile;
            }
          }))
          try {
            await window.FileService.fileCopy(sourcePath + "/" + sourceFiles[i].files[j].name, targetPath + "/" + targetFiles[i].files[j].name);
            setTargetFiles((targetFiles) => targetFiles.map((targetFile, index) => {
              if (index === i) {
                return {
                  ...targetFile,
                  files: targetFile.files.map((file, index) => {
                    if (index === j) {
                      return {
                        ...file,
                        status: ImageFlattenStatus.SUCCESS
                      }
                    } else {
                      return file;
                    }
                  })
                }
              } else {
                return targetFile;
              }
            }))
          } catch (e) {
            setTargetFiles((targetFiles) => targetFiles.map((targetFile, index) => {
              if (index === i) {
                return {
                  ...targetFile,
                  files: targetFile.files.map((file, index) => {
                    if (index === j) {
                      return {
                        ...file,
                        status: ImageFlattenStatus.FAIL
                      }
                    } else {
                      return file;
                    }
                  })
                }
              } else {
                return targetFile;
              }
            }))
          }
        }
      }
    } else {
      message.error("请选择来源/目标文件夹。");
    }
  }

  return (
    <Card>
      <div className={styles.container}>
        <div className={styles.column}>
          <Input.TextArea
            className={styles.mapping}
            placeholder={"在此处输入或粘贴映射关系。\n每条规则一行，以Tab键分隔源文件名和目标文件名。"}
            value={mapping}
            onChange={(e) => setMapping(e.target.value)}
          />
          <Button type="primary" onClick={() => handleExecute()} style={{ width: "100%" }}>开始执行</Button>
        </div>
        <div className={styles.column}>
          <div className={styles.header}>
            <Input
              placeholder="请选择源文件夹"
              value={sourcePath}
              readOnly
              onClick={() => {
                window.FileService.folderSelect().then((path) => setSourcePath(path));
              }}
              allowClear
            />
          </div>
          <div className={styles.files} ref={sourceRef}>
            {sourceFiles.map((sourceFile) => (
              <div key={sourceFile.name} className={styles.group}>
                <div className={styles.title}>{sourceFile.name}</div>
                <div className={styles.items}>
                  {sourceFile.files.length === 0 ? (
                    <div className={styles.empty}>暂无数据</div>
                  ) : sourceFile.files.map((file) => (
                    <div key={file.name} className={styles.item}>
                      <FileImageOutlined />
                      <span className={styles.path}>{file.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.header}>
            <Input
              placeholder="请选择目标文件夹"
              value={targetPath}
              readOnly
              onClick={() => {
                window.FileService.folderSelect().then((path) => setTargetPath(path));
              }}
            />
          </div>
          <div className={styles.files} ref={targetRef}>
            {targetFiles.map((targetFile) => (
              <div key={targetFile.name} className={styles.group}>
                <div className={styles.title}>{targetFile.name}</div>
                <div className={styles.items}>
                  {targetFile.files.length === 0 ? (
                    <div className={styles.empty}>暂无数据</div>
                  ) : targetFile.files.map((file) => (
                    <div key={file.name} className={styles.item}>
                      {file.status === ImageFlattenStatus.SUCCESS && <CheckCircleTwoTone twoToneColor="#52c41a" />}
                      {file.status === ImageFlattenStatus.FAIL && <CloseCircleTwoTone twoToneColor="#ff4d4f" />}
                      {file.status === ImageFlattenStatus.UNKNOW && <PauseCircleTwoTone twoToneColor="#bfbfbf" />}
                      {file.status === ImageFlattenStatus.LOADING && <LoadingOutlined />}
                      <span className={styles.path}>{file.name.split("/").map((node) => <span key={node}>{node}</span>)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}