import React from "react";
import style from "./menu.module.less";
import { Card, Collapse, Empty, Space } from "antd";
import { useNavigate } from "react-router";
import Metas from "./meta";

export default function Menu() {
  const navigate = useNavigate();
  return (
    <Space style={{ width: "100%" }} direction="vertical">
      {Metas.map((meta) => (
        <Collapse
          key={meta.path}
          bordered={false}
          activeKey={[meta.path]}
          expandIcon={() => meta.icon}
          items={[
            {
              key: meta.path,
              label: meta.label,
              children: meta.children.length > 0 ? (
                <div className={style.tools}>
                  {meta.children.map((menu) => (
                    <Card
                      key={menu.path}
                      size="small"
                      className={style.tool}
                      cover={
                        <div className={style["cover-container"]}>
                          {menu.cover}
                        </div>
                      }
                      onClick={() => navigate(menu.path)}
                    >
                      <Card.Meta
                        title={menu.label}
                        description={menu.description}
                      />
                    </Card>
                  ))}
                </div>
              ) : (
                <Empty description="暂无数据" />
              )
            }
          ]}
        />
      ))}
    </Space>
  );
}
