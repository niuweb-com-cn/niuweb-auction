import React, { useEffect, useMemo, useState } from "react";
import { Breadcrumb, ConfigProvider, Layout, Menu, theme } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import Logo from "../resources/logo.png";
import styles from "./layout.module.less";
import { Outlet, useLocation, useNavigate } from "react-router";
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import Metas from "./meta";

export default function App() {
  const [files, setFiles] = useState<string[]>([]);

  const [collapsed, setCollapsed] = useState(true);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();

  const breadcrumbs = useMemo(() => {
    const breadcrumbs: BreadcrumbItemType[] = [
      {
        title: <HomeOutlined />,
        onClick: () => navigate("/")
      },
    ];
    const meta = Metas.find((meta) => location.pathname.indexOf(meta.path) >= 0);
    if (meta) {
      breadcrumbs.push({ title: meta.label });

      const menu = meta.children.find((menu) => location.pathname.indexOf(menu.path) >= 0);
      if (menu) {
        breadcrumbs.push({ title: menu.label })
      }
    }
    return breadcrumbs;
  }, [location.pathname]);

  return (
    <ConfigProvider>
      <Layout style={{ height: "100vh" }}>
        <Layout.Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(nextCollapsed) => setCollapsed(nextCollapsed)}
        >
          <div
            className={[
              styles.logo,
              collapsed ? styles.collapsed : undefined,
            ].join(" ")}
            onClick={() => navigate("/")}
          >
            <img className={styles.icon} src={Logo} alt="NiuAuction" />
            <span className={styles.title}>NiuAuction</span>
          </div>
          <Menu
            theme="dark"
            items={Metas.map((meta) => ({
              key: meta.path,
              label: meta.label,
              icon: meta.icon,
              theme: "light",
              children: meta.children.map((menu) => ({
                key: menu.path,
                label: menu.label,
                onClick: () => navigate(menu.path),
              })),
            }))}
            selectedKeys={[location.pathname]}
          />
        </Layout.Sider>
        <Layout>
          <Layout.Header
            className={styles.header}
            style={{ backgroundColor: colorBgContainer }}
          >
            <Breadcrumb items={breadcrumbs} />
          </Layout.Header>
          <Layout.Content style={{ overflowY: "scroll", padding: 16 }}>
            <Outlet />
          </Layout.Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
