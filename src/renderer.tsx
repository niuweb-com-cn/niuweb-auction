import React from "react";
import { createRoot } from "react-dom/client";
import '@ant-design/v5-patch-for-react-19';
import { RouterProvider, createHashRouter } from "react-router";
import Layout from "./pages/layout";
import Menu from "./pages/menu";
import "./index.css";
import Metas from "./pages/meta";

console.log(...Metas.map((group) => ({
        path: group.path,
        chidren: group.children.map((child) => ({
          path: child.path,
          Component: child.component
        }))
      })))

const root = createRoot(document.getElementById('app'));
root.render(<RouterProvider router={createHashRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        path: "/",
        Component: Menu
      },
      ...Metas.map((group) => ({
        path: group.path,
        children: group.children.map((child) => ({
          path: child.path,
          Component: child.component
        }))
      }))
    ]
  }
])} />);