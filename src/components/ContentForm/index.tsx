import {
  defineComponent,
  reactive,
  Ref,
  ref,
  resolveComponent,
  h,
  computed,
  watch,
} from "vue";
import { useStyles } from "./style";
import { ThemeProvider } from "../../../lib/index";
import SchemaForm from "../../../lib";
import themeDefault from "../../../lib/theme-default";
import customFormat from "../../plugins/customFormats/index";
import customKeyword from "../../plugins/customKeywords/index";
import ActionComponentWrap from "../ActionComponentWrap";
const toJson = (data: any) => {
  return JSON.stringify(data, null, 2); // 保留格式的json转换
};
type Schema = any;
type UISchema = any;
interface DataType {
  schema: Schema | null;
  data: any;
  uiSchema: UISchema | null;
  schemaCode: string;
  dataCode: string;
  uiSchemaCode: string;
  customValidate?: (d: any, e: any) => void;
  inline?: boolean;
}

const ContentForm = defineComponent({
  name: "ContentForm",
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { slots }) {
    const classesRef = useStyles();
    const contextRef: Ref<any> = ref();
    const layoutList = reactive([]);
    const demo: DataType = reactive({
      schema: null,
      data: {},
      uiSchema: {},
      schemaCode: "",
      dataCode: "",
      uiSchemaCode: "",
      customValidate: undefined,
      inline: false,
    });

    const widgetList = reactive([]);
    const widgetObj = reactive({});

    const handleChange = (v: any) => {
      demo.data = v;
      demo.dataCode = toJson(v);
    };
    // 监听widgetList变化
    watch(
      () => widgetList,
      (newVal) => {
        console.log(newVal, "widgetList");
      },
      { deep: true },
    );

    // 监听layoutList变化
    watch(
      () => layoutList,
      (newVal) => {
        // console.log(newVal, "layoutList");
      },
      { deep: true },
    );

    const renderLayout = (element: any, classes: any) => {
      console.log(element, "renderLayout");
      // 布局组件
      return (
        <ActionComponentWrap>
          <div class={classes.layout}>
            <div class={classes.menuGroupName}>{element.name}</div>
            <div class={classes.layoutContent}>
              <div class={classes.layoutContentText}>拖入组件</div>
              <vue-draggable
                list={layoutList}
                force-fallback={true}
                group="list"
                itemKey="name"
                fallbackOnBody={true}
              >
                {{
                  item: ({ element: innerEl }: { element: any }) => {
                    return h(resolveComponent("ContentForm"), {
                      list: innerEl.children,
                    });
                  },
                }}
              </vue-draggable>
            </div>
          </div>
        </ActionComponentWrap>
      );
    };

    const onEnd = () => {
      console.log("拖拽完成了");
    };
    return () => {
      const classes = classesRef.value;
      return (
        <div>
          123
          <vue-draggable
            list={widgetList}
            force-fallback={true}
            group="list"
            itemKey="name"
            fallbackOnBody={true}
            chosenClass={classes.chosen}
            end={onEnd}
          >
            {{
              item: ({ element }: { element: any }) => {
                console.log(element, "布局组件");
                if (element.type !== "layout") {
                  // 非布局组件
                  return (
                    <ActionComponentWrap>
                      <div class={classes.layout}>
                        <div class={classes.menuGroupName}>{element.name}</div>
                        <div class={classes.normalContent}>
                          <ThemeProvider theme={themeDefault}>
                            <SchemaForm
                              schema={element.schema}
                              uiSchema={element.uiSchema || {}}
                              onChange={handleChange}
                              value={element.data}
                              contextRef={contextRef}
                              customValidate={element.customValidate}
                              inline={element.name.inline}
                              customFormats={customFormat}
                              customKeywords={customKeyword}
                            />
                          </ThemeProvider>
                        </div>
                      </div>
                    </ActionComponentWrap>
                  );
                } else {
                  // 布局组件
                  return renderLayout(element, classes);
                }
              },
            }}
          </vue-draggable>
        </div>
      );
    };
  },
});
export default ContentForm;
