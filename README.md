# retarded-m-app

阿帐-记账帮手 - 微信小程序

### ---- 引入多色图标步骤 ---------------

1. npm install mini-program-iconfont-cli --save-dev 安装插件

2. npx iconfont-init 初始化配置文件

修改："symbol_url": "http://at.alicdn.com/t/font_1710408_jcm2hp79rc.js",

3. npx iconfont-wechat 生成小程序文件，复制到小程序目录下

4. 在小程序 app.json 中引入

```
{
    "usingComponents": {
        "iconfont": "/iconfont/iconfont"
    }
}
```

5. 引用

```
<iconfont name="alipay" />
```

6. 变更时，修改 symbol_url 再执行 npx iconfont-wechat 即可