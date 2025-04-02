/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { createElement } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { BaseLayout, MainLayout, RootError } from "../components";

/**
 * Application routes
 * https://reactrouter.com/en/main/routers/create-browser-router
 */
export const router = createBrowserRouter([
  {
    path: "",
    element: <BaseLayout />,
    errorElement: <RootError />,
    children: [
      { path: "login", lazy: () => import("./login") },
      { path: "privacy", lazy: () => import("./privacy") },
      { path: "terms", lazy: () => import("./terms") },
    ],
  },
  {
    path: "",
    element: <MainLayout />,
    errorElement: <RootError />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", lazy: () => import("./dashboard") },
      { path: "services", lazy: () => import("./services") },
      { path: "contact", lazy: () => import("./contact") },
      { path: "board", lazy: () => import("./board") },
      { path: "board/write", lazy: () => import("./board/write") },
      { path: "board/post/:id", lazy: () => import("./board/post") },
      { path: "board/edit/:id", lazy: () => import("./board/edit") },
      { path: "tasks", lazy: () => import("./tasks") },
      { path: "messages", lazy: () => import("./messages") },
      { path: "payment", lazy: () => import("./payment") },
      { path: "payment/complete", lazy: () => import("./payment/complete") },
      { path: "simple-payment", lazy: () => import("./simple-payment") },
      {
        path: "payment/simple-complete",
        lazy: () => import("./payment/simple-complete"),
      },
    ],
  },
]);

export function Router(): JSX.Element {
  return createElement(RouterProvider, { router });
}

// Clean up on module reload (HMR)
// https://vitejs.dev/guide/api-hmr
if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}
