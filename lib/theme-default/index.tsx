import SelectionWidget from "./SelectionWidget";
import TextWidget from "./TextWidget";
import { commonWidgetPropsDefine, CommonWidgetDefine } from "../types";
import { defineComponent } from "vue";

const CommonWidget: any = defineComponent({
  props: commonWidgetPropsDefine,
  setup() {
    return () => null;
  },
});

export default {
  widgets: {
    SelectionWidget,
    TextWidget,
    NumberWidget: CommonWidget,
  },
};
