# Live2D-with-music-player
![image](https://github.com/crowya/Live2D-with-music-player/assets/61354956/ada1511d-5fbe-4e1e-b1ba-b656236706b6)

Hi，这是鸦鸦自用的宠物播放器。  
此版本极大地简化了代码逻辑，主要特点是：
1. 不再需要 API
2. 不再需要自定义 CSS（已集成到 waifu.css）
3. 不再需要 waifu-tips.js（已合并到 autoload.js）
4. 不再需要修改任何 JS（所有配置参数已挪到页尾脚本）

现在，使用者可以专心定制说话内容和模型皮肤，而不再需要理解复杂的代码。
## 快速复现指南
1. 下载整个 live2d 文件夹，通过宝塔面板上传到 `/www/wwwroot/wordpress/wp-content/uploads/`。
2. 页尾脚本一共需要添加这些东西：（链接换成自己的）
```
<!--博客宠物-->
<script>const live2d_path = "https://crowya.com/wp-content/uploads/live2d/";</script>
<script src="https://crowya.com/wp-content/uploads/live2d/autoload.js"></script>
<!--音乐播放器-->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css">
<script src="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/meting@2.0.1/dist/Meting.min.js"></script>
<meting-js server="tencent" type="playlist" id="8559460487" theme="#339981" fixed="true" preload="none" autoplay="false" loop="all" order="random" volume="0.3"></meting-js>
<script>
ap = null;
Object.defineProperty(document.querySelector('meting-js'), "aplayer", {
    set: function(aplayer) {
        ap = aplayer;
        ap_init();
    }
});
</script>
```
## 文件功能说明（深度定制指南）
- model——模型文件直接作为子文件夹放于其中（可以自定义）  
- model_list.json——模型列表（可以自定义）  
- waifu-tips.json——对话文本（可以自定义）  
- live2d.min.js——Live2D动画核心文件，不需要修改  
- autoload.js——按钮功能，一般不需要修改  
- waifu.css——外观样式，一般不需要修改  

详情参阅：[Live2D 宠物功能修改 | 音乐播放器+右键秘密通道](https://crowya.com/1088)  
