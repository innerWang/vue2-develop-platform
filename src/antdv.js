import Vue from 'vue';
import {
  Button,
  Dropdown,
  Icon,
  Menu,
  Tooltip,
  Table,
  Spin,
  Row,
  Col,
  FormModel,
  Input,
  Layout,
  message,
  Popover,
  Tree,
  Modal,
  Select,
  Divider,
  TreeSelect,
  ConfigProvider,
  Steps,
  Form,
  Tag,
  DatePicker,
  Tabs,
  Breadcrumb,
  Result,
  Radio,
  InputNumber,
} from 'ant-design-vue';

Vue.use(Button);
Vue.use(Dropdown);
Vue.use(Icon);
Vue.use(Menu);
Vue.use(Tooltip);
Vue.use(Table);
Vue.use(Spin);
Vue.use(Row);
Vue.use(Col);
Vue.use(FormModel);
Vue.use(Input);
Vue.use(Layout);
Vue.use(Popover);
Vue.use(Tree);
Vue.use(Modal);
Vue.use(Select);
Vue.use(Divider);
Vue.use(TreeSelect);
Vue.use(ConfigProvider);
Vue.use(Steps);
Vue.use(Form);
Vue.use(Tag);
Vue.use(DatePicker);
Vue.use(Tabs);
Vue.use(Breadcrumb);
Vue.use(Result);
Vue.use(Radio);
Vue.use(InputNumber);

Vue.prototype.$message = message;
Vue.prototype.$modal = Modal;
