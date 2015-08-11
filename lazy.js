app.directive('lazy', ['$window','$q', function($window, $q){
    var win = $window,
        $win = angular.element(win),
        uid = 0,
        elements = {},
        loadedImgs = {};
    function getUid(el){
        return el.__uid || (el.__uid = '' + ++uid);
    }

    function isVisible(e,preload){
        var pos = e.getBoundingClientRect();
        if (pos.top - document.documentElement.scrollTop - (typeof(preload) == "undefined"?600:preload) <= document.documentElement.clientHeight) {
            return true;
        } else {
            return false;
        }
    }

    function refreshImage(){
        Object.keys(elements).forEach(function(key){
            var obj = elements[key],
                preLoad = obj.$scope.preload,
                scope = obj.$scope
            iElement = obj.iElement;
            if(isVisible(iElement,preLoad)){
                updateImg(iElement,scope,obj);
            }
        });
    }

    $win.bind('touchmove', refreshImage);
    $win.bind('scroll', refreshImage);
    function updateImg(imgEl,scope,obj){
        if((obj && !obj.isLoading) || !obj){
            var img = document.createElement('img');
            var uid = getUid(imgEl);
            var myImg = imgEl;
            imgEl = angular.element(imgEl);
            img.src = imgEl.attr('scsrc');
            obj && (obj.isLoading = true);
            img.onload = function() {
                if(img.src !== scope.scsrc) return;
                obj && (obj.isLoading = false);
                setState(scope,'sc');
                setSrc(imgEl[0],img.src);
                loadedImgs[img.src] = true;
                if(elements.hasOwnProperty(uid)){
                    delete elements[uid];
                }
            }
            img.onerror = function() {
                if(img.src !== scope.scsrc) return;
                obj && (obj.isLoading = false);
                setSrc(imgEl[0],imgEl.attr('ersrc'));
                setState(scope,'er');
            }
        }
    }
    function setSrc(el,src){
        if(el.nodeName.toLowerCase() === 'img')
            el.src = src;
        else
            el.style.backgroundImage = 'url('+src+')';
    }
    function setState(scope,state){
        if(['sc','df','er'].indexOf(state)==-1){
            console.log('state赋值错误');
            return;
        }
        scope.state = state;
        scope['on'+state] && scope['on'+state]();
        try{
            scope.$parent.$digest();
        }catch(e){
        }
    }
    return {
        restrict: 'A',
        scope: {
            lazy:'@',//boolean 是否开启懒加载
            preload:'@',//预先加载的距离 默认距离是600;暂时没有监听ios的惯性移动。此值请根据页面的长度自行设置（最大惯性移动的距离）
            ersrc:'@',//加载失败替换的图片地址error(请确保ersrc是个不会加载失败的图片)
            dfsrc:'@',//加载成功前的默认占位图片default
            scsrc:'@',//加载成功替换的地址success
            wpsrc:'@',//获得webp图片的链接。
            nmsrc:'@',//获得jpg/png图片的链接（和webp一起使用，用于备用）。
            onsc:'&',
            oner:'&',
            ondf:'&',
            hasAnimate:'@'
        },
        link: function($scope, iElement){
            $scope.lazy = ($scope.lazy == "false" || $scope.lazy == false)?false:true;
            $scope.hasAnimate = ($scope.hasAnimate == "false" || $scope.hasAnimate == false)?false:true;
            iElement = iElement[0];
            var uid = getUid(iElement);
            //初始化全部设置为默认图片
            setSrc(iElement,$scope.dfsrc);
            setState($scope,'df');
            $scope.preload = $scope.preload?Number($scope.preload):600;
            var watchid = [];
            watchid[0] = $scope.$watch('dfsrc', function(){
                //当前显示的是默认图片
                if($scope.state == "df"){
                    setSrc(iElement,$scope.dfsrc);
                }else{//当前显示的不是错误图片

                }
            });

            watchid[1] = $scope.$watch('ersrc', function(){
                //当前显示的是错误图片
                if($scope.state == "er"){
                    setSrc(iElement,$scope.ersrc);
                }else{//当前显示的不是错误图片

                }
            });

            watchid[2] = $scope.$watch('scsrc', function(){
                if(loadedImgs[$scope.scsrc]){
                    setState($scope,'sc');
                    setSrc(iElement,$scope.scsrc);
                    return;
                }
                setSrc(iElement,$scope.dfsrc);
                setState($scope,'df');
                if($scope.lazy && !isVisible(iElement,$scope.preload)){//此部分暂时隐藏在可视区域外-->不加载新图片,替换成默认图片

                    //加入touchmove用于检测需要懒加载的数据
                    elements[uid] = {
                        iElement: iElement,
                        $scope: $scope
                    };
                }else{
                    //替换顺序：默认图片->成功图片/失败图片
                    updateImg(iElement,$scope);
                }
            });
            isSupportWebp().then(function success(){
              if($scope.wpsrc)
                watchid[3] = $scope.$watch('wpsrc', function(){
                    $scope.scsrc = $scope.wpsrc;
                });
            },function failure(){
              if($scope.wpsrc)
                watchid[3] = $scope.$watch('nmsrc', function(){
                    $scope.scsrc = $scope.nmsrc;
                });
            });
            $scope.$on('$destroy', function(){
                if(elements.hasOwnProperty(uid)){
                    delete elements[uid];
                }
                watchid.forEach(function(watch){
                    watch();
                });
            });
            function isSupportWebp(){
              var img = new Image(),
                  deferred = $q.defer();
              img.src = "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA";
              img.onload = function () {
                  if((img.width > 0) && (img.height > 0)){
                    deferred.resolve();
                  }else{
                    deferred.reject();
                  }
              };
              img.onerror = function () {
                deferred.reject();
              };
              isSupportWebp = function() {return deferred.promise};//让图片的加载永远只执行一次
              return deferred.promise;
            }
        }
    };
}]);
