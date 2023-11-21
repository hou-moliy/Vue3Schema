import {
  defineComponent,
  reactive,
  Ref,
  ref,
  resolveComponent,
  h,
  computed,
  watchEffect,
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

    const handleChange = (v: any) => {
      demo.data = v;
      demo.dataCode = toJson(v);
    };
    watchEffect(() => {
      console.log("props.list", props.list);
    });

    return () => {
      const classes = classesRef.value;
      return (
        <div>
          <vue-draggable
            list={props.list}
            force-fallback={true}
            group="list"
            itemKey="name"
            fallbackOnBody={true}
            chosenClass={classes.chosen}
          >
            {{
              item: ({ element }: { element: any }) => {
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
                  return (
                    <ActionComponentWrap>
                      <div class={classes.layout}>
                        <div class={classes.menuGroupName}>{element.name}</div>
                        <div class={classes.layoutContent}>
                          <div class={classes.layoutContentText}>拖入组件</div>
                          <vue-draggable
                            list={element.values}
                            force-fallback={true}
                            group="list"
                            itemKey="name"
                            fallbackOnBody={true}
                          >
                            {{
                              item: ({
                                element: innerEl,
                              }: {
                                element: any;
                              }) => {
                                return h(resolveComponent("ContentForm"), {
                                  list: innerEl.values,
                                });
                              },
                            }}
                          </vue-draggable>
                        </div>
                      </div>
                    </ActionComponentWrap>
                  );
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
