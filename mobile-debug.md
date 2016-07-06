# 使用 Tool Box 进行移动端调试

好消息，好消息，工具盒子加入了移动端与 PC 端联调功能。

我们先来看个 GIF，

![示例](https://cloud.githubusercontent.com/assets/13482086/16608611/f51fd100-437f-11e6-8b94-ab9b61f7222f.gif)

###### 调试示例

是不是很方便？接下来我们来讲解如何使用 Tool Box 的移动端调试功能进行真机调试。

<br />

## 如何真机调试

### 开启代理服务器

真机调试需要保证手机在 WIFI 环境下与 PC 同一网段中，然后通过如 Fiddler 之类代理设置后使手机通过 PC 进行网络请求。

Tool Box 的移动端调试界面中集成了代理服务器功能。如图：

![代理服务器面板](https://cloud.githubusercontent.com/assets/13482086/16608875/dc9c3fa4-4381-11e6-89fd-52cd5955f552.png)

###### 代理服务器面板

开启代理服务器之后，将手机的 WIFI 网络设置为本机代理即可。

<br />

### 开启调试功能

网络搞定之后，我们就可以开启调试功能了。

调试功能的界面和 safari 的调试面板十分相似。

![面板](https://cloud.githubusercontent.com/assets/13482086/16608881/eaa150ee-4381-11e6-8336-8793d445d0a4.png)

###### 调试面板

<br />

### 在网页中注入调试脚本

需要在调试的网页中注入以下脚本方可成功调试，

```HTML
<script src="http://ip_address:port/target/target-script-min.js#accoun_id"></script>
```

这个脚本的链接中包含了如下信息，对应面板上方的三个输入框（IP，PORT，账号）。

- ip_address: 联调的 PC 机 IP
- port: 联调端口
- accoun_id: 个人联调账号

另外注意，其中的 `accoun_id` 默认值为 `anonymous`，在多人联调时应注明你自己的账号，以免和他人产生冲突。

这里顺带安利一下 [mobile-console](https://github.com/ajccom/mobile-console) 项目，使用它可以轻松通过界面在 debug 时进行脚本注入 [查看 DEMO](http://ajccom.github.io/mobile-console/)。

<br />

## Thanks

<br />













