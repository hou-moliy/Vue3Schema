import { createUseStyles } from "vue-jss"; // 引入开源项目，用js写css
export const useStyles = createUseStyles({
  // 写样式，字段就相当于class名
  headTool: {
    width: "100%",
    height: 60,
    lineHeight: "60px",
    textAlign: "center",
    fontSize: 20,
    fontWeight: 600,
    background: "#fff",
    boxShadow: "0px 0px 10px rgba(0,0,0,.5)",
    marginBottom: 20,
  },
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    margin: "0 auto",
    position: "relative",
  },
  menu: {
    width: 365,
    borderRight: "1px solid #ddd",
    padding: 10,
    boxSizing: "border-box",
  },
  takeBase: {
    width: 0,
    height: 0,
    borderWidth: 10,
    borderStyle: "solid",
    borderColor: "transparent #0099CC transparent transparent",
    position: "absolute",
    top: 0,
    cursor: "pointer",
  },
  takeIn: {
    left: 325,
  },
  takeOut: {
    left: 0,
  },
  code: {
    width: 700,
    flexShrink: 0,
  },
  codePanel: {
    minHeight: 400,
    marginBottom: 20,
  },
  uiAndValue: {
    display: "flex",
    justifyContent: "space-between",
    "& > *": {
      width: "46%",
    },
  },
  content: {
    display: "flex",
    height: "100%",
    flex: 1,
    justifyContent: "space-between",
  },
  form: {
    padding: "20px",
    flex: 1,
    background: "#f5f5f5",
    boxSizing: "border-box",
    border: "1px dashed #bbbbbb",
    height: "100%",
    "& > div > div": {
      width: "100%",
      height: "100%",
      minHeight: "100vh",
    },
  },
  menuGroup: {
    "&+&": {
      marginTop: 20,
    },
  },
  menuGroupName: {
    fontSize: 15,
    fontWeight: 700,
    lineHeight: "18px",
    color: "#666",
  },
  dragContent: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },
  menuButton: {
    marginTop: 10,
    cursor: "move",
    display: "inline-block",
    padding: 15,
    boxSizing: "border-box",
    background: "#f2f2f2",
    width: "47%",
    textAlign: "center",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    "&:hover": {
      border: "1px dashed #337ab7",
      boxShadow: "0px 0px 5px #337ab7",
    },
  },
  layout: {
    height: "100%",
    backgroundColor: "#fff",
    border: "1px dashed #bbb",
    padding: "30px 10px 10px",
    "&+&": {
      marginTop: 10,
    },
    "&:hover": {
      border: "1px solid #0099CC",
    },
  },
  layoutContent: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    marginTop: 10,
    "&:nth-child(2)": {
      width: "100%",
      height: "100%",
    },
  },
  layoutContentText: {
    textAlign: "center",
    color: "#bbb",
    cursor: "move",
  },
  normalContent: {
    marginTop: 10,
  },
  tools: {
    width: 380,
    height: "100%",
    background: "#fff",
    padding: 20,
    boxSizing: "border-box",
    borderLeft: "1px solid #ddd",
  },
  toolsHeader: {
    fontSize: 16,
    marginBottom: 10,
    display: "flex",
    justifyContent: "flex-start",
  },
  toolsHeaderItem: {
    cursor: "pointer",
    padding: "5px 10px",
    borderRadius: 5,
    "&:hover": {
      background: "#ddd",
    },
    "&.active": {
      background: "#337ab7",
    },
    "&+&": {
      marginLeft: 10,
    },
  },
  chosen: {
    "&:hover": {
      boxShadow: "0px 0px 5px #337ab7",
    },
  },
});
