## 1.自定指令 lintfix ,执行该条指令，就可以自动将代码格式化成eslint的格式

###在package.json添加

```
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint",
    "lintfix": "eslint --ext .js,.vue src --fix"
  },
```

## 2.发现eslint太烦人了，把eslint关掉,
### 把package.json中关于eslint配置的代码注释掉，即下面这段代码
```
  "eslintConfig": {
    "root": true,
    "env": {
      "node": true
    },
    "extends": [
      "plugin:vue/essential",
      "@vue/standard"
    ],
    "parserOptions": {
      "parser": "babel-eslint"
    },
    "rules": {}
  },

```
### 接着创建vue.config.js文件，在文件里写入
```
module.exports = {
    lintOnSave: false
}

```

## 3.导航组件的调整
```
 <el-menu
                        default-active="2"
                        class="el-menu-vertical-demo"
                        @close="handleClose"
                        background-color="#545c64"
                        text-color="#fff"
                        active-text-color="#ffd04b">
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>导航一</span>
                        </template>
                        <el-menu-item index="1-1">
                            <i class="el-icon-location"></i>
                            <span>选线一</span>
                        </el-menu-item>
                    </el-submenu>

                </el-menu>
```

## 4.封装全局axios插件
```
const MyHttpServer = {}
import axios from 'axios'
MyHttpServer.install = (Vue) =>{
    Vue.prototype.$http = axios
};
export default MyHttpServer
```

## 5.定义全局事件格式化过滤器
```
Vue.filter('formatTime',(v)=>{
  return moment(v).format("YYYY-MM-DD")
})
```

### 6.表格事件使用过滤器 调整
```
 <el-table-column
        prop="create_time"
        label="创建日期">
    <template slot-scope="scope">
        {{scope.row.create_time | formatTime}}
    </template>
 </el-table-column>
```

### 7.用这个方法可以一下子清除表单
```
this.form={}
```
