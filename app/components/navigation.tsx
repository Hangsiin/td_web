/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import {
  AssignmentTurnedInRounded,
  ChatRounded,
  Dashboard,
  BusinessCenter,
  ContactPage,
  Forum,
} from "@mui/icons-material";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  ListProps,
} from "@mui/joy";
import { ReactNode, memo } from "react";
import { Link, useMatch } from "react-router-dom";

export const Navigation = memo(function Navigation(
  props: NavigationProps,
): JSX.Element {
  const { sx, ...other } = props;

  return (
    <List
      sx={{ "--ListItem-radius": "4px", ...sx }}
      size="sm"
      role="navigation"
      {...other}
    >
      <NavItem path="/dashboard" label="홈" icon={<Dashboard />} />
      <NavItem path="/services" label="서비스" icon={<BusinessCenter />} />
      <NavItem path="/board" label="게시판" icon={<Forum />} />
      <NavItem path="/contact" label="문의하기" icon={<ContactPage />} />
      <NavItem
        path="/simple-payment"
        label="결제하기"
        icon={<BusinessCenter />}
      />
      <NavItem
        path="/tasks"
        label="Tasks"
        icon={<AssignmentTurnedInRounded />}
      />
      <NavItem path="/messages" label="Messages" icon={<ChatRounded />} />
    </List>
  );
});

function NavItem(props: NavItemProps): JSX.Element {
  return (
    <ListItem>
      <ListItemButton
        component={Link}
        selected={!!useMatch(props.path)}
        to={props.path}
        aria-current="page"
      >
        <ListItemDecorator children={props.icon} />
        <ListItemContent>{props.label}</ListItemContent>
      </ListItemButton>
    </ListItem>
  );
}

type NavigationProps = Omit<ListProps, "children">;
type NavItemProps = {
  path: string;
  label: string;
  icon: ReactNode;
};
