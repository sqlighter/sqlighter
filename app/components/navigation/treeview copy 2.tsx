import * as React from "react"
import PropTypes from "prop-types"
import { styled } from "@mui/material/styles"
import Box from "@mui/material/Box"
import MuiTreeView from "@mui/lab/TreeView"
import MuiTreeItem, { treeItemClasses as muiTreeItemClasses } from "@mui/lab/TreeItem"
import Typography from "@mui/material/Typography"
import MailIcon from "@mui/icons-material/Mail"
import DeleteIcon from "@mui/icons-material/Delete"
import Label from "@mui/icons-material/Label"
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount"
import InfoIcon from "@mui/icons-material/Info"
import ForumIcon from "@mui/icons-material/Forum"
import LocalOfferIcon from "@mui/icons-material/LocalOffer"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"

const StyledTreeItemRoot = styled(MuiTreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${muiTreeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    "&.Mui-expanded": {
      fontWeight: theme.typography.fontWeightRegular,
    },
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: "var(--tree-view-color)",
    },
    [`& .${muiTreeItemClasses.label}`]: {
      fontWeight: "inherit",
      color: "inherit",
    },
  },
  [`& .${muiTreeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${muiTreeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
}))

export interface StyleTreeItemProps {
  id?: string

  title: string

  tags?: string

  bgColor?: string
  color?: any
  icon: React.ElementType

  children2?: StyleTreeItemProps[]

  children?: any
}

function StyledTreeItem(props: StyleTreeItemProps) {
  const { id, color, icon, tags, title, children2, children, ...other } = props

  return (
    <StyledTreeItemRoot
      nodeId={id}
      label={
        <Box sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0 }}>
          <Box component={icon || MailIcon} color="inherit" sx={{ mr: 1 }} />
          <Typography variant="body2" sx={{ fontWeight: "inherit", flexGrow: 1 }}>
            {title}
          </Typography>
          <Typography variant="caption" color="inherit">
            {tags}
          </Typography>
        </Box>
      }
      {...other}
    >
      {children &&
        children.map((child, index) => {
          return <StyledTreeItem key={index+child.title} {...child} />
        })}
    </StyledTreeItemRoot>
  )
}

export interface TreeViewProps {
  /** Items to be shown in tree view */
  items?: StyleTreeItemProps[]

  /** Will show filtered results based on given string */
  filter?: string
}

export function TreeView({ items, filter }: TreeViewProps) {
  return (
    <Box>
      <MuiTreeView
        aria-label="gmail"
        defaultExpanded={["1"]}
        defaultCollapseIcon={<ArrowDropDownIcon />}
        defaultExpandIcon={<ArrowRightIcon />}
        defaultEndIcon={<div style={{ width: 24 }} />}
        sx={{ height: 264, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
      >
        {items?.length > 0 &&
          items.map((item, index) => {
            return <StyledTreeItem key={index} {...item} />
          })}
      </MuiTreeView>
    </Box>
  )
}

export function GmailTreeView() {
  return (
    <MuiTreeView
      aria-label="gmail"
      defaultExpanded={["3"]}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
      sx={{ height: 264, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
    >
      <StyledTreeItem nodeId="1" labelText="All Mail" labelIcon={MailIcon} />
      <StyledTreeItem nodeId="2" labelText="Trash" labelIcon={DeleteIcon} />
      <StyledTreeItem nodeId="3" labelText="Categories" labelIcon={Label}>
        <StyledTreeItem
          nodeId="5"
          labelText="Social"
          labelIcon={SupervisorAccountIcon}
          labelInfo="90"
          color="#1a73e8"
          bgColor="#e8f0fe"
        />
        <StyledTreeItem
          nodeId="6"
          labelText="Updates"
          labelIcon={InfoIcon}
          labelInfo="2,294"
          color="#e3742f"
          bgColor="#fcefe3"
        />
        <StyledTreeItem
          nodeId="7"
          labelText="Forums"
          labelIcon={ForumIcon}
          labelInfo="3,566"
          color="#a250f5"
          bgColor="#f3e8fd"
        />
        <StyledTreeItem
          nodeId="8"
          labelText="Promotions"
          labelIcon={LocalOfferIcon}
          labelInfo="733"
          color="#3c8039"
          bgColor="#e6f4ea"
        />
      </StyledTreeItem>
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
    </MuiTreeView>
  )
}
