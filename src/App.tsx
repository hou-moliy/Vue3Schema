import {
  defineComponent,
  reactive,
  Ref,
  ref,
  watchEffect,
  shallowRef,
} from "vue";
import { useStyles } from "@/css/appStyle"; // 引入开源项目，用js写css
import MonacoEditor from "./components/MonacoEditor";
import demos from "./demos";
import SchemaForm from "../lib";
import themeDefault from "../lib/theme-default";
import { ThemeProvider } from "../lib/index";
import customFormat from "./plugins/customFormats/index";
import customKeyword from "./plugins/customKeywords/index";
import library from "./demos/library";
import useRenderContentForm from "./hooks/userRenderContentForm";
// import { Schema } from "../lib/types";
// TODO: 在lib中export
type Schema = any;
type UISchema = any;
const toJson = (data: any) => {
  return JSON.stringify(data, null, 2); // 保留格式的json转换
};

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

    const {
      widgetList,
      layoutList,
      handleChange,
      classesRef,
      contextRef,
      renderContentForm,
    } = useRenderContentForm(demo);
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

    const validateForm = () => {
      contextRef.value.doValidate().then((result: any) => {
        console.log(result, "result");
      });
    };
    const componentsShow = ref(true);
    const handleTakeIn = () => {
      componentsShow.value = !componentsShow.value;
    };

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

              {library.list.map((group: any) => (
                <div class={classes.menuGroup}>
                  <div class={classes.menuGroupName}>
                    {group.name}({group.components.length})
                  </div>
                  <vue-draggable
                    list={group.components}
                    force-fallback={true}
                    group={{ name: "list", pull: "clone" }}
                    sort={false}
                    itemKey="name"
                    class={classes.dragContent}
                  >
                    {{
                      item: ({ element }: { element: any }) => (
                        <div class={classes.menuButton}>{element.name}</div>
                      ),
                    }}
                  </vue-draggable>
                </div>
              ))}
            </div>
            {/* 内容区域 */}
            <div class={classes.content}>
              {/* 表单展示 */}
              <div class={classes.form}>{renderContentForm(classes)}</div>
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
