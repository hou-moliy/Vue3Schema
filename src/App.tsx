import {
  defineComponent,
  reactive,
  Ref,
  ref,
  watchEffect,
  shallowRef,
} from "vue";
import { createUseStyles } from "vue-jss"; // 引入开源项目，用js写css
import MonacoEditor from "./components/MonacoEditor";
import demos from "./demos";
import SchemaForm from "../lib";
import themeDefault from "../lib/theme-default";
import { ThemeProvider } from "../lib/index";
import customFormat from "./plugins/customFormats/index";
import customKeyword from "./plugins/customKeywords/index";
import library from "./demos/library";
// import { Schema } from "../lib/types";
// TODO: 在lib中export
type Schema = any;
type UISchema = any;
const toJson = (data: any) => {
  return JSON.stringify(data, null, 2); // 保留格式的json转换
};

const useStyles = createUseStyles({
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
    flex: 1,
    justifyContent: "space-between",
  },
  form: {
    padding: "20px",
    flex: 1,
    background: "#f5f5f5",
    boxSizing: "border-box",
    border: "1px dashed #bbbbbb",
    "& > div": {
      width: "100%",
      height: "100%",
    },
  },
  menuButton: {
    appearance: "none",
    borderWidth: 0,
    cursor: "pointer",
    display: "inline-block",
    padding: 15,
    boxSizing: "border-box",
    background: "#f2f2f2",
    "&:hover": {
      border: "1px dashed #337ab7",
      boxShadow: "0px 0px 5px #337ab7",
    },
  },
  menuSelected: {
    "&:hover": {
      border: "1px dashed #337ab7",
      boxShadow: "0px 0px 5px #337ab7",
    },
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
});

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

export default defineComponent({
  setup() {
    const selectedRef: Ref<number> = ref(0);

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

    watchEffect(() => {
      const index = selectedRef.value;
      const d: any = demos[index];
      demo.schema = d.schema;
      demo.data = d.default;
      demo.uiSchema = d.uiSchema;
      demo.schemaCode = toJson(d.schema);
      demo.dataCode = toJson(d.default);
      demo.uiSchemaCode = toJson(d.uiSchema);
      demo.inline = d.inline;
      // 判断是否有自定义校验 有就赋值 没有就undefined 用来传给SchemaForm
      if (Object.prototype.hasOwnProperty.call(d, "customValidate")) {
        demo.customValidate = d.customValidate;
      }
    });

    const methodRef: Ref<any> = ref();
    const classesRef = useStyles();
    const handleChange = (v: any) => {
      demo.data = v;
      demo.dataCode = toJson(v);
    };

    const handleCodeChange = (
      filed: "schema" | "data" | "uiSchema",
      value: string,
    ) => {
      // 在当前页面修改了code就会触发

      try {
        const json = JSON.parse(value);
        demo[filed] = json[`${filed}Code`] = value;
      } catch (e) {
        console.error(e);
      }
    };
    const handleSchemaChange = (v: string) => handleCodeChange("schema", v);
    const handleDataChange = (v: string) => handleCodeChange("data", v);
    const handleUISchemaChange = (v: string) => handleCodeChange("uiSchema", v);

    const contextRef: Ref<any> = ref();

    const validateForm = () => {
      contextRef.value.doValidate().then((result: any) => {
        console.log(result, "result");
      });
    };
    const componentsShow = ref(true);
    const handleTakeIn = () => {
      componentsShow.value = !componentsShow.value;
    };
    const widgetList = reactive([]);
    return () => {
      const classes = classesRef.value;
      return (
        <div>
          <div class={classes.headTool}>这里是标题</div>
          <div class={classes.container}>
            {/* 组件栏 */}
            <div
              class={{
                [classes.takeBase]: true,
                [classes.takeIn]: componentsShow.value,
                [classes.takeOut]: !componentsShow.value,
              }}
              onClick={handleTakeIn}
            ></div>
            <div class={classes.menu} v-show={componentsShow.value}>
              {/* 组件列表 */}
              <vue-draggable
                list={library.list}
                force-fallback={true}
                group={{ name: "list", pull: "clone" }}
                sort={false}
                itemKey="name"
              >
                {{
                  item: ({ element }: { element: any }) => (
                    console.log(element, "element"),
                    (
                      <div>
                        {/* {library.list.map((com, index) => (
                        <div
                          class={{
                            [classes.menuButton]: true,
                          }}
                        > */}
                        {/* {com.name} */}
                        {/* </div>
                      ))} */}
                        123
                      </div>
                    )
                  ),
                }}
              </vue-draggable>
            </div>
            {/* 内容区域 */}
            <div class={classes.content}>
              {/* 表单展示 */}
              <div class={classes.form}>
                <vue-draggable
                  list={widgetList}
                  force-fallback={true}
                  group="list"
                  itemKey="name"
                  fallbackOnBody={true}
                >
                  {{
                    item: ({ element }: { element: any }) => (
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
                    ),
                  }}
                </vue-draggable>
                {/* <ThemeProvider theme={themeDefault}>
                  <SchemaForm
                    schema={demo.schema}
                    uiSchema={demo.uiSchema || {}}
                    onChange={handleChange}
                    value={demo.data}
                    contextRef={contextRef}
                    customValidate={demo.customValidate}
                    inline={demo.inline}
                    customFormats={customFormat}
                    customKeywords={customKeyword}
                  />
                </ThemeProvider>
                <button onClick={validateForm}>校验</button> */}
              </div>
              {/* code展示 */}
              <div class={classes.code} v-show={false}>
                <MonacoEditor
                  code={demo.schemaCode}
                  class={classes.codePanel}
                  onChange={handleSchemaChange}
                  title="Schema"
                />
                <div class={classes.uiAndValue}>
                  <MonacoEditor
                    code={demo.uiSchemaCode}
                    class={classes.codePanel}
                    onChange={handleUISchemaChange}
                    title="UISchema"
                  />
                  <MonacoEditor
                    code={demo.dataCode}
                    class={classes.codePanel}
                    onChange={handleDataChange}
                    title="Value"
                  />
                </div>
              </div>
              {/* 表单配置项 */}
              <div class={classes.tools}>
                <div class={classes.toolsHeader}>
                  <div class={classes.toolsHeaderItem}>组件配置</div>
                  <div class={classes.toolsHeaderItem}>表单配置</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };
  },
});
