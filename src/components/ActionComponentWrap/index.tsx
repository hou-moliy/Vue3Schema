import { defineComponent } from "vue";
import { useStyles } from "./style";

const ActionComponentWrap = defineComponent({
  name: "ActionComponentWrap",
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    curItem: {
      type: Object,
      default: null,
    },
  },
  setup(props, { slots }) {
    const classesRef = useStyles();

    const handleDelete = () => {
      console.log("删除");
    };

    const handleCopy = () => {
      console.log("复制");
    };

    const handleUp = () => {
      console.log("上移");
    };

    const handleDown = () => {
      console.log("下移");
    };

    return () => {
      const classes = classesRef.value;
      return (
        <div>
          {/* 操作栏-删除,复制,上移动,下移动按钮 */}
          <div class={classes.actionWrap}>
            <img
              class={classes.actionItem}
              src={require("@/assets/base/delete.png")}
              onClick={handleDelete}
              alt=""
            />
            <img
              class={classes.actionItem}
              src={require("@/assets/base/copy.png")}
              onClick={handleCopy}
              alt=""
            />
            <img
              class={classes.actionItem}
              src={require("@/assets/base/up.png")}
              onClick={handleUp}
              alt=""
            />
            <img
              class={classes.actionItem}
              src={require("@/assets/base/down.png")}
              onClick={handleDown}
              alt=""
            />
          </div>
          {slots.default ? slots.default() : null}
        </div>
      );
    };
  },
});
export default ActionComponentWrap;
