#ng-lazyLoad
A directive to load images on demand for angular.
1. It can be used as `background-image` in `<div>` or just an image on `<img>`;
2. It supports **webp** if compatible and other normal images;
3. **Callback** will be invoked both the image loaded successfully or not;
4. It only supports mobile website.

##Usage
###on `image`

      <img lazy scsrc="hello.png" dfsrc="default.png" ersrc="error.png"/>

`scsrc` **success src:** Your target image.

`dfsrc` **default src:** The placeholder image.

`ersrc` **error src:** The image when loaded fail.

###on `background-image`
      <div lazy scsrc="hello.png" dfsrc="default.png" ersrc="error.png"></div>

###using webp
      <div lazy wpsrc="hello.webp" nmsrc="hello.jpg" dfsrc="default.png" ersrc="error.png"></div>

###using callbacks

      <div lazy scsrc="hello.png" dfsrc="default.png" ersrc="error.png" onsc="showShadow()"></div>
##config
|name|description|
|-|
|scsrc|target image url|
|dfsrc|default image url|
|ersrc|error image url|
|onsc|do it when the image loaded `scsrc` successfully and show `scsrc`|
|oner|do it when the image loaded `scsrc` failure and show `ersrc`|
|ondf|do it when the image turn to default image|
|wpsrc|url of webp image|
|nmsrc|url of jpg/png image(normal image) when using webp|
