declare module "@emotion/react/jsx-runtime" {
  export * from "react/jsx-runtime";
}

declare module "@emotion/react" {
  import * as React from "react";

  export interface Theme {
    [key: string]: any;
  }

  export interface ThemeProviderProps {
    theme: Theme | ((outerTheme: Theme) => Theme);
    children?: React.ReactNode;
  }

  export const ThemeProvider: React.FC<ThemeProviderProps>;

  export function useTheme(): Theme;

  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}
