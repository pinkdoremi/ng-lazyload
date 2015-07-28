#ng-lazyLoad
一个移动端上按需加载图片的angular指令。

1. 它可以使用在image标签上，也可以当做background-image来使用。
2. 它支持webp格式图片的懒加载，并且以一种如果设备兼容webp则加载webp，否则加载jpg/png图片的策略。
3. 它在加载成功或者失败时，会产生回调。
4. 它适合webp app应用，主要因为
    1. 在检测可视区域时，只检测纵向是否符合可视区域并没有检测横向。
    2. 失败图片，默认图片，如果采用读取本地的话，效果比较好。但是如果失败图片，默认图片都需要加载，就没有这种失败，默认的意义了。
5. 对于当前ng生命周期内加载完成的图片会做缓存，不会再滚动到可视区域内后再加载，而会直接显示。

##使用方法

###image标签上的用法

  <img lazy scsrc="hello.png" dfsrc="default.png" ersrc="error.png"/>

其中有以下属性：

+ lazy 表示开启懒加载
+ scsrc 目标图片地址
+ dfsrc 失败图片地址
+ ersrc 默认图地址

###作为background-image的用法

  <div lazy scsrc="hello.png" dfsrc="default.png" ersrc="error.png"></div>

只要作用在非img标签上的lazy指令，默认采用background-image的方式。

###webp图片使用

  <img lazy wpsrc="hello.webp" nmsrc="hello.jpg" dfsrc="default.png" ersrc="error.png"/>
using callbacks

不用设置scsrc.只用设置nmsrc(备用jpg/png图)和wpsrc(webp图片).

###使用回调

  <img lazy scsrc="hello.png" dfsrc="default.png" ersrc="error.png" onsc="showShadow()"/>

+ onsc 加载成功后的回调
+ ondf 加载默认图时回调
+ oner 加载失败时的回调

可以在回调后，显示阴影，渐变，覆盖图能图片上的装饰物。防止这些装饰物在图片还没加载出来的时候就显示在默认图上。
