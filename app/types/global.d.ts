import * as React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module "react-router-dom" {
  export interface LinkProps {
    to: string;
    replace?: boolean;
    state?: any;
    relative?: "route" | "path";
    reloadDocument?: boolean;
    preventScrollReset?: boolean;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export const Link: React.FC<LinkProps>;
  export const NavLink: React.FC<LinkProps>;
  export const Outlet: React.FC;
  export const useNavigate: () => (
    to: string,
    options?: { replace?: boolean; state?: any },
  ) => void;
  export const useLocation: () => {
    pathname: string;
    search: string;
    hash: string;
    state: any;
  };
  export const useParams: () => Record<string, string>;
  export const useSearchParams: () => [
    URLSearchParams,
    (nextInit: URLSearchParams) => void,
  ];

  export function createBrowserRouter(routes: any[], options?: any): any;
  export function RouterProvider(props: { router: any }): JSX.Element;
  export function Await(props: {
    children: React.ReactNode;
    resolve: Promise<any>;
    errorElement?: React.ReactNode;
  }): JSX.Element;
  export function Form(props: any): JSX.Element;
}
