# CurdCreate说明文档
> 核心设计参考 https://vvbin.cn/，内部根据element-plus做个调整

## 安装
```shell
# 请切换小象内部npm数据源 http://npm.xiaoxiangyoupin.cn:4873/
nrm use basestone

yarn add @hobby/auth2.x

```

## 表单组件API
[文档](./form.md)


## 表格组件API
[文档](./table.md)

## Q&A
- el-input组件使用onchange为什么不能在输入的触发？
> ant-design-vue自定义事件如下 onChange: handleChange,onInput: handleChange,触发的同一个事件
> element-plus自定义事件如下，>    onInput: handleInput,onChange: handleChange,则为两个不同事件

- element-plus双向绑定事件的关键key 使用的是modelValue/v-model



