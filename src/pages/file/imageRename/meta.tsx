import React from "react";
import styles from "./meta.module.less";
import { DoubleRightOutlined, FileImageOutlined } from "@ant-design/icons";
import { MenuMeta } from "../../interface";
import ImageRename from ".";

const ImageRenameMeta: MenuMeta = {
  path: "/file/imageRename",
  label: "根据映射关系修改文件名称",
  description: "根据导入的映射关系内容，将源目录下的文件，根据文件名前缀匹配，重命名并移动至目标目录。",
  cover: (
    <div>
      <div className={[styles.cover, styles["image-flatten-cover"]].join(" ")}>
        <div className={styles.column} style={{ background: "#fffdf0ff" }}>
          <div className={styles.map}>
            <span>801</span>
            <span>Lot.1</span>
          </div>
          <div className={styles.map}>
            <span>802</span>
            <span>Lot.2</span>
          </div>
          <div className={styles.map}>
            <span>803</span>
            <span>Lot.3</span>
          </div>
        </div>
        <div className={styles.column} style={{ background: "#f0f5ff" }}>
          <div><FileImageOutlined /> 801[1].jpg</div>
          <div><FileImageOutlined /> 801[2].jpg</div>
          <div><FileImageOutlined /> 802(1).jpg</div>
          <div><FileImageOutlined /> 803.jpg</div>
        </div>
        <div className={styles.column} style={{ background: "#f6ffed" }}>
          <div><FileImageOutlined /> Lot.1[1].jpg</div>
          <div><FileImageOutlined /> Lot.1[2].jpg</div>
          <div><FileImageOutlined /> Lot.2(1).jpg</div>
          <div><FileImageOutlined /> Lot.3.jpg</div>
        </div>
        <div className={styles.icon}>
          <DoubleRightOutlined />
        </div>
      </div>
    </div>
  ),
  component: ImageRename
}
export default ImageRenameMeta;