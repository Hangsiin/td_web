declare module "@mui/joy" {
  import * as React from "react";

  export interface BoxProps {
    component?: React.ElementType;
    sx?: any;
    children?: React.ReactNode;
    id?: string;
    [key: string]: any;
  }
  export const Box: React.FC<BoxProps>;

  export interface ButtonProps {
    variant?: "plain" | "outlined" | "solid" | "soft";
    color?: "primary" | "neutral" | "danger" | "info" | "success" | "warning";
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
    disabled?: boolean;
    loading?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    startDecorator?: React.ReactNode;
    endDecorator?: React.ReactNode;
    children?: React.ReactNode;
    sx?: any;
    component?: React.ElementType;
    [key: string]: any;
  }
  export const Button: React.FC<ButtonProps>;

  export interface CardProps {
    variant?: "plain" | "outlined" | "soft" | "solid";
    color?: "primary" | "neutral" | "danger" | "info" | "success" | "warning";
    orientation?: "vertical" | "horizontal";
    size?: "sm" | "md" | "lg";
    children?: React.ReactNode;
    sx?: any;
    [key: string]: any;
  }
  export const Card: React.FC<CardProps>;

  export interface CardContentProps {
    children?: React.ReactNode;
    sx?: any;
    [key: string]: any;
  }
  export const CardContent: React.FC<CardContentProps>;

  export interface ChipProps {
    variant?: "plain" | "outlined" | "soft" | "solid";
    color?: "primary" | "neutral" | "danger" | "info" | "success" | "warning";
    size?: "sm" | "md" | "lg";
    startDecorator?: React.ReactNode;
    endDecorator?: React.ReactNode;
    children?: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    sx?: any;
    [key: string]: any;
  }
  export const Chip: React.FC<ChipProps>;

  export interface ContainerProps {
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
    disableGutters?: boolean;
    fixed?: boolean;
    children?: React.ReactNode;
    sx?: any;
    [key: string]: any;
  }
  export const Container: React.FC<ContainerProps>;

  export interface DividerProps {
    orientation?: "horizontal" | "vertical";
    children?: React.ReactNode;
    sx?: any;
    [key: string]: any;
  }
  export const Divider: React.FC<DividerProps>;

  export interface FormControlProps {
    required?: boolean;
    disabled?: boolean;
    error?: boolean;
    size?: "sm" | "md" | "lg";
    color?: "primary" | "neutral" | "danger" | "info" | "success" | "warning";
    children?: React.ReactNode;
    sx?: any;
    [key: string]: any;
  }
  export const FormControl: React.FC<FormControlProps>;

  export interface FormLabelProps {
    required?: boolean;
    children?: React.ReactNode;
    sx?: any;
    [key: string]: any;
  }
  export const FormLabel: React.FC<FormLabelProps>;

  export interface GridProps {
    container?: boolean;
    spacing?: number;
    columns?: number;
    rowSpacing?: number;
    columnSpacing?: number;
    direction?: "row" | "row-reverse" | "column" | "column-reverse";
    children?: React.ReactNode;
    sx?: any;
    [key: string]: any;
  }
  export const Grid: React.FC<GridProps>;

  export interface IconButtonProps {
    variant?: "plain" | "outlined" | "soft" | "solid";
    color?: "primary" | "neutral" | "danger" | "info" | "success" | "warning";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    children?: React.ReactNode;
    sx?: any;
    [key: string]: any;
  }
  export const IconButton: React.FC<IconButtonProps>;

  export interface InputProps {
    placeholder?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    error?: boolean;
    required?: boolean;
    size?: "sm" | "md" | "lg";
    color?: "primary" | "neutral" | "danger" | "info" | "success" | "warning";
    startDecorator?: React.ReactNode;
    endDecorator?: React.ReactNode;
    name?: string;
    sx?: any;
    [key: string]: any;
  }
  export const Input: React.FC<InputProps>;

  export interface LinkProps {
    href?: string;
    color?: "primary" | "neutral" | "danger" | "info" | "success" | "warning";
    underline?: "none" | "hover" | "always";
    overlay?: boolean;
    level?:
      | "h1"
      | "h2"
      | "h3"
      | "h4"
      | "h5"
      | "h6"
      | "body1"
      | "body2"
      | "body3";
    variant?: "plain" | "outlined" | "soft" | "solid";
    children?: React.ReactNode;
    component?: React.ElementType;
    sx?: any;
    [key: string]: any;
  }
  export const Link: React.FC<LinkProps>;

  export interface ListProps {
    component?: React.ElementType;
    size?: "sm" | "md" | "lg";
    orientation?: "horizontal" | "vertical";
    children?: React.ReactNode;
    sx?: any;
    [key: string]: any;
  }
  export const List: React.FC<ListProps>;

  export interface ListItemProps {
    component?: React.ElementType;
    children?: React.ReactNode;
    nested?: boolean;
    sticky?: boolean;
    sx?: any;
    [key: string]: any;
  }
  export const ListItem: React.FC<ListItemProps>;

  export interface ListItemButtonProps {
    component?: React.ElementType;
    selected?: boolean;
    color?: "primary" | "neutral" | "danger" | "info" | "success" | "warning";
    variant?: "plain" | "outlined" | "soft" | "solid";
    children?: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    sx?: any;
    [key: string]: any;
  }
  export const ListItemButton: React.FC<ListItemButtonProps>;

  export interface ListItemContentProps {
    children?: React.ReactNode;
    sx?: any;
    [key: string]: any;
  }
  export const ListItemContent: React.FC<ListItemContentProps>;

  export interface ListItemDecoratorProps {
    children?: React.ReactNode;
    sx?: any;
    [key: string]: any;
  }
  export const ListItemDecorator: React.FC<ListItemDecoratorProps>;

  export interface OptionProps {
    value?: string | number;
    disabled?: boolean;
    children?: React.ReactNode;
    sx?: any;
    [key: string]: any;
  }
  export const Option: React.FC<OptionProps>;

  export interface SelectProps {
    placeholder?: string;
    value?: string | null;
    defaultValue?: string;
    onChange?: (
      event: React.SyntheticEvent | null,
      value: string | null,
    ) => void;
    disabled?: boolean;
    error?: boolean;
    required?: boolean;
    size?: "sm" | "md" | "lg";
    color?: "primary" | "neutral" | "danger" | "info" | "success" | "warning";
    children?: React.ReactNode;
    sx?: any;
    [key: string]: any;
  }
  export const Select: React.FC<SelectProps>;

  export interface StackProps {
    direction?: "row" | "row-reverse" | "column" | "column-reverse";
    spacing?: number;
    divider?: React.ReactNode;
    children?: React.ReactNode;
    sx?: any;
    [key: string]: any;
  }
  export const Stack: React.FC<StackProps>;

  export interface TableProps {
    size?: "sm" | "md" | "lg";
    color?: "primary" | "neutral" | "danger" | "info" | "success" | "warning";
    variant?: "plain" | "outlined" | "soft" | "solid";
    children?: React.ReactNode;
    sx?: any;
    [key: string]: any;
  }
  export const Table: React.FC<TableProps>;

  export interface TextareaProps {
    placeholder?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    disabled?: boolean;
    error?: boolean;
    required?: boolean;
    minRows?: number;
    maxRows?: number;
    size?: "sm" | "md" | "lg";
    color?: "primary" | "neutral" | "danger" | "info" | "success" | "warning";
    name?: string;
    sx?: any;
    [key: string]: any;
  }
  export const Textarea: React.FC<TextareaProps>;

  export interface TypographyProps {
    level?:
      | "h1"
      | "h2"
      | "h3"
      | "h4"
      | "h5"
      | "h6"
      | "body1"
      | "body2"
      | "body3";
    component?: React.ElementType;
    children?: React.ReactNode;
    sx?: any;
    [key: string]: any;
  }
  export const Typography: React.FC<TypographyProps>;
}
