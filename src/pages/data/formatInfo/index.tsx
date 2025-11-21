import { CloseCircleOutlined, CopyOutlined, ExportOutlined, SearchOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Card, Input, InputRef, Modal, Space, Table, TableColumnsType, TableColumnType, Upload } from "antd";
import React, { useRef, useState } from "react";
import Highlighter from 'react-highlight-words';
import styles from "./index.module.less";
import { FilterDropdownProps } from "antd/es/table/interface";

interface FormateData {
  lot: number;
  name: string;
  price: [number | undefined, number | undefined];
  description: string[];
}

export default function FormatInfo() {
  const [showCopy, setShowCopy] = useState<boolean>(false);
  const [textData, setTextData] = useState<string>("");
  const [tableData, setTableData] = useState<FormateData[]>([]);
  
  const handleImport = () => {
    window.FileService.fileSelect().then((filepath) => {
      window.FileService.fileImport(filepath).then((data: string) => {
        setTextData(data);
        handleParse(data);
      })
    })
  }

  const handleParse = (data: string) => {
    const tableData: FormateData[] = []
    const items = data.split(/(\r?\n){3}/);
    for (const item of items) {
      const lines = item.split(/\r?\n/);
      // 清理头部空行
      while(lines[0] === "") lines.shift();
      if (lines.length === 0) continue;

      // 首行格式检查
      const lotMatch = lines[0].match(/^■?(\d+)$/);
      if (!lotMatch) continue;

      const tableItem: FormateData = {
        lot: Number(lotMatch[1]),
        name: lines[1],
        price: [undefined, undefined],
        description: [lines[3]]
      }

      for (let i = 5; i < lines.length; i++) {
        const priceMatch = lines[i].match(/^(无底价|RMB:\s?([\d,]+)-([\d,]+))$/);
        if (priceMatch) {
          tableItem.price[0] = priceMatch[2] ? Number(priceMatch[2].replaceAll(",", "")) : undefined;
          tableItem.price[1] = priceMatch[3] ? Number(priceMatch[3].replaceAll(",", "")) : undefined;
        } else {
          tableItem.description.push(lines[i]);
        }
      }

      tableData.push(tableItem);
    }
    setTableData(tableData);
  }

  const handleExport = () => {
    window.FileService.fileExport("output.csv", "\n"+tableData.map((item) => `,${item.lot},${item.name},${item.price[0]},${item.price[1]},,,,,${item.description.join("<br/>")}`).join("\n"))
  }

  const columns: TableColumnsType<FormateData> = [
    {
      dataIndex: "lot",
      title: "Lot."
    },
    {
      dataIndex: "name",
      title: "名称"
    },
    {
      key: "price",
      title: "价格",
      render: (_, record) => {
        return [record.price[0], record.price[1]].join("-");
      }
    },
    {
      dataIndex: "description",
      title: "描述",
      render: (description: string[]) => description.map((desc) => <div key={desc}>{desc}</div>)
    }
  ]

  return (
    <Card>
      <div className={styles.header}>
        <Space.Compact>
          <Button icon={<UploadOutlined />} onClick={() => handleImport()}>上传文件</Button>
          <Button icon={<CopyOutlined />} onClick={() => setShowCopy(true)}>粘贴文本</Button>
        </Space.Compact>
        <Button type="primary" icon={<ExportOutlined />} onClick={() => handleExport()}>导出</Button>
      </div>
      <Table<FormateData>
        columns={columns}
        dataSource={tableData}
        rowKey={"lot"}
      />
      <Modal
        open={showCopy}
        title="粘贴文本"
        okText="确定"
        onOk={() => {
          handleParse(textData);
          setShowCopy(false);
        }}
        cancelText="取消"
        onCancel={() => {
          setShowCopy(false)
        }}
      >
        <Input.TextArea value={textData} onChange={(e) => setTextData(e.target.value)} rows={13} />
      </Modal>
    </Card>
  );
}