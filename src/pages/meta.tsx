import React from "react";
import Icon from "@ant-design/icons";
import IconFile from "../resources/icon_file.svg?react";
import IconData from "../resources/icon_data.svg?react";
import { MenuMeta } from "./interface";
import FileMetas from "./file/meta";
import DataMetas from "./data/meta";

interface MenuMetaGroup {
  path: string;
  label: string;
  icon: React.ReactNode;
  children: MenuMeta[];
}

const Metas: MenuMetaGroup[] = [
  {
    path: "/file",
    label: "文件整理",
    icon: <Icon component={IconFile} />,
    children: FileMetas
  },
  {
    path: "/data",
    label: "数据处理",
    icon: <Icon component={IconData} />,
    children: DataMetas
  }
];
export default Metas;