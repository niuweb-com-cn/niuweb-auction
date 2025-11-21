import React from "react";
import styles from "./meta.module.less";
import { DoubleRightOutlined, FileImageOutlined, FolderOpenOutlined } from "@ant-design/icons";
import { MenuMeta } from "../../interface";
import ImageFlatten from ".";

const ImageFlattenMeta: MenuMeta = {
  path: "/file/imageFlatten",
  label: "根据文件名移动图片至文件夹中",
  description: "整理目录下所有文件，将原文件名以中划线分隔，作为目标目录名及文件名进行移动。",
  cover: (
    <div>
      <div className={[styles.cover, styles["image-flatten-cover"]].join(" ")}>
        <div className={styles.column} style={{ background: "#f0f5ff" }}>
          <div><FileImageOutlined /> 1-1.jpg</div>
          <div><FileImageOutlined /> 1-2.jpg</div>
          <div><FileImageOutlined /> 2-1.jpg</div>
        </div>
        <div className={styles.column} style={{ background: "#f6ffed" }}>
          <div className={styles.fold}>
            <div><FolderOpenOutlined /> 1</div>
            <div className={styles.files}>
              <div><FileImageOutlined /> 1.jpg</div>
              <div><FileImageOutlined /> 2.jpg</div>
            </div>
          </div>
          <div className={styles.fold}>
            <div><FolderOpenOutlined /> 2</div>
            <div className={styles.files}>
              <div><FileImageOutlined /> 1.jpg</div>
            </div>
          </div>
        </div>
        <div className={styles.icon}>
          <DoubleRightOutlined />
        </div>
      </div>
    </div>
  ),
  component: ImageFlatten,
}
export default ImageFlattenMeta;