import { createUseStyles } from "vue-jss"; // 引入开源项目，用js写css
export const useStyles = createUseStyles({
  menuGroupName: {
    fontSize: 15,
    fontWeight: 700,
    lineHeight: "18px",
    color: "#666",
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
    cursor: "move",
    "&>div": {
      width: "100%",
      minHeight: 50,
      "&>div": {
        width: "100%",
        minHeight: 50,
        "&>div": {
          width: "100%",
          minHeight: 50,
        },
      },
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
  chosen: {
    "&:hover": {
      boxShadow: "0px 0px 5px #337ab7",
    },
  },
});
