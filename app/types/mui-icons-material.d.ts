declare module "@mui/icons-material" {
  import * as React from "react";

  export interface SvgIconProps {
    color?:
      | "inherit"
      | "primary"
      | "secondary"
      | "action"
      | "disabled"
      | "error";
    fontSize?: "inherit" | "small" | "medium" | "large";
    sx?: any;
    [key: string]: any;
  }

  export type SvgIconComponent = React.ComponentType<SvgIconProps>;

  export const Add: SvgIconComponent;
  export const ArrowBackIosNew: SvgIconComponent;
  export const ArrowForwardIos: SvgIconComponent;
  export const Search: SvgIconComponent;
  export const Home: SvgIconComponent;
  export const Info: SvgIconComponent;
  export const ContactSupport: SvgIconComponent;
  export const Dashboard: SvgIconComponent;
  export const Forum: SvgIconComponent;
  export const Menu: SvgIconComponent;
  export const Close: SvgIconComponent;
  export const Person: SvgIconComponent;
  export const Settings: SvgIconComponent;
  export const Logout: SvgIconComponent;
  export const Login: SvgIconComponent;
  export const AssignmentTurnedInRounded: SvgIconComponent;
  export const ChatRounded: SvgIconComponent;
  export const BusinessCenter: SvgIconComponent;
  export const ContactPage: SvgIconComponent;
}
