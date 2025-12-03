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

export default function ImageFlatten() {
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

  const [sourceFiles, setSourceFiles] = useState<{ name: string }[]>([]);
  const [targetFiles, setTargetFiles] = useState<{ name: string; status: ImageFlattenStatus }[]>([]);
  useEffect(() => {
    if (sourcePath) {
      window.FileService.folderList(sourcePath).then((files) => {
        const fileList = files.filter((file) => file.filePath.match(/.+(-.+)+\.(jpg|jpeg|png)/i));
        setSourceFiles(fileList.map((file) => ({ name: file.filePath })));
        setTargetFiles(fileList.map((file) => ({ name: file.filePath.replaceAll("-", "/"), status: ImageFlattenStatus.UNKNOW })));
      })
    }
  }, [sourcePath]);

  const handleExecute = async () => {
    if (sourcePath && targetPath && Array.isArray(sourceFiles) && Array.isArray(targetFiles) && sourceFiles.length === targetFiles.length) {
      for (let i = 0; i < sourceFiles.length; i++) {
        setTargetFiles((targetFiles) => targetFiles.map((targetFile, index) => {
          if (index === i) {
            return {
              ...targetFile,
              status: ImageFlattenStatus.LOADING
            }
          } else {
            return targetFile;
          }
        }))
        try {
          await window.FileService.fileCopy(sourcePath + "/" + sourceFiles[i].name, targetPath + "/" + targetFiles[i].name);
          setTargetFiles((targetFiles) => targetFiles.map((targetFile, index) => {
            if (index === i) {
              return {
                ...targetFile,
                status: ImageFlattenStatus.SUCCESS
              }
            } else {
              return targetFile;
            }
          }))
        } catch(e) {
          setTargetFiles((targetFiles) => targetFiles.map((targetFile, index) => {
            if (index === i) {
              return {
                ...targetFile,
                status: ImageFlattenStatus.FAIL
              }
            } else {
              return targetFile;
            }
          }))
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
          <Input
            placeholder="请选择源文件夹"
            value={sourcePath}
            readOnly
            onClick={() => {
              window.FileService.folderSelect().then((path) => setSourcePath(path));
            }}
            allowClear
          />
          <div className={styles.files} ref={sourceRef}>
            {sourceFiles.map((sourceFile) => (
              <div key={sourceFile.name} className={styles.file}>
                <FileImageOutlined />
                <span className={styles.path}>{sourceFile.name}</span>
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
            <Button type="primary" onClick={() => handleExecute()}>开始执行</Button>
          </div>
          <div className={styles.files} ref={targetRef}>
            {targetFiles.map((targetFile) => (
              <div key={targetFile.name} className={styles.file}>
                {targetFile.status === ImageFlattenStatus.SUCCESS && <CheckCircleTwoTone twoToneColor="#52c41a" />}
                {targetFile.status === ImageFlattenStatus.FAIL && <CloseCircleTwoTone twoToneColor="#ff4d4f" />}
                {targetFile.status === ImageFlattenStatus.UNKNOW && <PauseCircleTwoTone twoToneColor="#bfbfbf" />}
                {targetFile.status === ImageFlattenStatus.LOADING && <LoadingOutlined />}
                <span className={styles.path}>{targetFile.name.split("/").map((node) => <span key={node}>{node}</span>)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}