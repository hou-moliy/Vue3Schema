import { defineComponent } from "vue";
import { useStyles } from "./style";

const ActionComponentWrap = defineComponent({
  name: "ActionComponentWrap",
  setup(props, { slots }) {
    const classesRef = useStyles();

    return () => {
      const classes = classesRef.value;
      return (
        <div>
          <div>
            {/* 操作栏-删除,复制,上移动,下移动按钮 */}
            <div class={classes.actionWrap}>
              <img
                class={classes.actionItem}
                src={require("@/assets/base/delete.png")}
                alt=""
              />
              <img
                class={classes.actionItem}
                src={require("@/assets/base/copy.png")}
                alt=""
              />
              <img
                class={classes.actionItem}
                src={require("@/assets/base/up.png")}
                alt=""
              />
              <img
                class={classes.actionItem}
                src={require("@/assets/base/down.png")}
                alt=""
              />
            </div>
          </div>
          {slots.default ? slots.default() : null}
        </div>
      );
    };
  },
});
export default ActionComponentWrap;
