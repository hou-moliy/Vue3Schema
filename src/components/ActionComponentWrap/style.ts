import { createUseStyles } from "vue-jss"; // 引入开源项目，用js写css
export const useStyles = createUseStyles({
  // 写样式，字段就相当于class名
  actionWrap: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0 10px",
    height: "40px",
    gap: "10px",
  },
  actionItem: {
    width: 20,
    height: 20,
  },
});
