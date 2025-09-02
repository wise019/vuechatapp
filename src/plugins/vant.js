import Vue from 'vue'
import {
  Button,
  NavBar,
  Tabbar,
  TabbarItem,
  Field,
  CellGroup,
  Cell,
  Icon,
  Image,
  Toast,
  Dialog,
  Loading,
  Popup,
  Picker,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
  Switch,
  Tag,
  Grid,
  GridItem,
  Checkbox,
  ActionSheet
} from 'vant'

// 注册组件
Vue.use(Button)
Vue.use(NavBar)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Field)
Vue.use(CellGroup)
Vue.use(Cell)
Vue.use(Icon)
Vue.use(Image)
Vue.use(Toast)
Vue.use(Dialog)
Vue.use(Loading)
Vue.use(Popup)
Vue.use(Picker)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Switch)
Vue.use(Tag)
Vue.use(Grid)
Vue.use(GridItem)
Vue.use(Checkbox)
Vue.use(ActionSheet)

// 设置Toast默认配置
Toast.setDefaultOptions({
  duration: 2000,
  position: 'middle'
})

// 设置Dialog默认配置
Dialog.setDefaultOptions({
  confirmButtonText: '确定',
  cancelButtonText: '取消'
})
