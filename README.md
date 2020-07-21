# miniprogram-xigua-datepicker

[![](https://img.shields.io/npm/v/miniprogram-xigua-datepicker.svg?style=flat-square)](https://www.npmjs.com/package/miniprogram-xigua-datepicker)
[![](https://img.shields.io/npm/dw/miniprogram-xigua-datepicker?style=flat-square)](https://www.npmjs.com/package/miniprogram-xigua-datepicker)
[![](https://img.shields.io/travis/7pou/miniprogram-xigua-datepicker.svg?style=flat-square)](https://github.com/7pou/miniprogram-xigua-datepicker)
[![](https://img.shields.io/github/license/7pou/miniprogram-xigua-datepicker.svg?style=flat-square)](https://github.com/7pou/miniprogram-xigua-datepicker)
[![](https://img.shields.io/codecov/c/github/7pou/miniprogram-xigua-datepicker.svg?style=flat-square)](https://github.com/7pou/miniprogram-xigua-datepicker)

小程序自定义组件-日期选择器：

* 支持日期选择
* 支持日期区间选择
* 调用简单(只有一个方法)

## 使用

1. 安装 datepicker

```
npm install --save miniprogram-xigua-datepicker
```

2. 在需要使用 datepicker 的页面 page.json 中添加 datepicker 自定义组件配置

```
{
  "usingComponents": {
    "Datepicker": "miniprogram-xigua-datepicker"
  }
}
```

3. 在wxml文件 挂载 datepicker 组件,并声明id

```
<Datepicker id="datepicker" />
```

4. 在js文件中调用

```
this.selectComponent('#datepicker').open({
    vaule: ['2000-01-01 12:00', '2020-01-01 11:00'],
    onChange: (res) => { console.log(res) }
})
```

## 参数说明

| 参数          | 类型                  | 是否必填 | 默认值    | 说明                         |
| ------------ | --------------------- | ------ | -------- | ---------------------------- |
| value        | string 或者 string []  | 否     | 空       | 初始值                        |
| title        | string                | 否     | 选择日期   | 选择器标题                    |
| confirmColor | string                | 否     | #e74845  | 确认按钮颜色                   |
| range        | boolean               | 否     | true     | 是否是日期区间                 |
| showTime     | boolean               | 否     | true     | 是否显示时间                   |
| zIndex       | number                | 否     | 1        | 组件层级                      |
| beforeHook   | function              | 否     | ()=>true | 点击确定的校验方法,需要返回布尔值 |
| onChange     | function              | 是     | null     | 点击确定的回调函数              |
| onCancel     | function              | 否     | null     | 点击取消的回调函数              |
| onScroll     | function              | 否     | null     | 滚动的回调函数                 |

