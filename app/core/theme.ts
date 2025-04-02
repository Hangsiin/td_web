/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { extendTheme, ThemeProvider as Provider } from "@mui/joy/styles";
import { createElement, ReactNode } from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";

/**
 * Customized Joy UI theme.
 * @see https://mui.com/joy-ui/customization/approaches/
 */
export const theme = extendTheme({
  colorSchemes: {
    light: {},
    dark: {},
  },
  shadow: {},
  typography: {},
  components: {},
});

/**
 * Material UI theme for compatibility with Material UI components
 */
export const materialTheme = createTheme({
  components: {
    MuiAvatar: {
      styleOverrides: {
        root: {
          // Custom styles for Avatar if needed
        },
      },
    },
  },
});

export function ThemeProvider(props: ThemeProviderProps): JSX.Element {
  return createElement(
    MuiThemeProvider,
    { theme: materialTheme },
    createElement(Provider, { theme, ...props }),
  );
}

export type ThemeProviderProps = {
  children: ReactNode;
};
