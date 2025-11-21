import { MenuMeta } from "src/pages/interface";
import FormatInfo from ".";
import React from "react";
import styles from "./meta.module.less";
import { DoubleRightOutlined } from "@ant-design/icons";

const FormatInfoMeta: MenuMeta = {
  path: "/data/formatInfo",
  label: "将标的文本信息格式化为表格文件",
  description: "将以文本文件形式存储的标的信息，格式化为Excel表格文件。",
  cover: (
    <div>
      <div className={[styles.cover, styles["format-info-cover"]].join(" ")}>
        <div className={styles.column} style={{ background: "#f0f5ff" }}>
          <div className={styles.lot}>
            <div>1001</div>
            <div>标的名称</div>
            <div>Subject Name</div>
            <div>RMB: 100,000-200,000</div>
          </div>
          <div className={styles.lot}>
            <div>1002</div>
          </div>
        </div>
        <div className={styles.column} style={{ background: "#f6ffed" }}>
          <table className={styles.table} cellSpacing={0}>
            <tbody>
              <tr>
                <td>1001</td>
                <td>标的名称</td>
                <td>100,000</td>
                <td>200,000</td>
              </tr>
              <tr>
                <td>1002</td>
                <td>标的1002</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>1003</td>
                <td>标的1003</td>
                <td>10,000</td>
                <td>30,000</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.icon}>
          <DoubleRightOutlined />
        </div>
      </div>
    </div>
  ),
  component: FormatInfo
}
export default FormatInfoMeta;