// import initBMap from './baidu'

let $options;
class CMap {
    constructor(options){
        $options = options
        this.mapAk = 'f7HnzEYGLgOyMyDVTh99ZEQqjlEzuhyC';
        this.initMap()
    }
    // 初始化地图 
    initMap(){
        const { type } = $options
        if(type && type === 'TMAP'){
            this.createTMap()
        } else if (type && type === 'GMAP') {
            this.createGMap()
        } else {
            this.createBMap()
            // this.createBMap().then(res => {
            //     console.log(333)
            //     initBMap()
            // })
        }
        
    }
    
    createBMap(){
        // let script = document.createElement('script');
        // script.type = 'text/javascript';
        // script.src = `//api.map.baidu.com/api?type=webgl&v=1.0&ak=${this.mapAk}&callback=initBMap`; // &callback=initBMap
        // document.head.appendChild(script);
       
        window.BMapGL_loadScriptTime = (new Date).getTime();
        window.BMapGL = window.BMapGL || {};
        window.BMapGL.apiLoad = function () {
            delete window.BMapGL.apiLoad;
            if (typeof initBMap == "function") {
                initBMap()
            }
        };
        var s = document.createElement('script');
        s.src = `http://api.map.baidu.com/getscript?type=webgl&v=1.0&ak=f7HnzEYGLgOyMyDVTh99ZEQqjlEzuhyC&services=&t=${(new Date).getTime()}`;
        document.body.appendChild(s);
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', 'http://api.map.baidu.com/res/webgl/10/bmap.css');
        document.getElementsByTagName('head')[0].appendChild(link);



        // script.onload = script.onreadystatechange = function(){
        //     console.log(33, window, window.onBMapCallback)
        //     // resolve(BMap);
        // }
        // return new Promise((resolve, reject) => {
        //     // 如果已加载直接返回
        //     if(typeof BMap !== "undefined") {
        //         resolve(BMap);
        //         return true;
        //     }
        //     window.BMapGL_loadScriptTime = (new Date).getTime();
        //     let script = document.createElement('script');
        //     script.type = 'text/javascript';
        //     // script.src = `http://api.map.baidu.com/getscript?v=3.0&ak=f7HnzEYGLgOyMyDVTh99ZEQqjlEzuhyC&services=&t=${ (new Date()).getTime()}`; 
        //     script.src = `//api.map.baidu.com/api?type=webgl&v=1.0&ak=${this.mapAk}` // &callback=initBMap
        //     document.body.appendChild(script);
        //     let link = document.createElement('link');
        //     link.rel = 'stylesheet'
        //     link.type = 'text/css'
        //     link.href = 'http://api.map.baidu.com/res/webgl/10/bmap.css'
        //     document.body.appendChild(link);
        //     // 百度地图异步加载回调处理

        //     // console.log(window, window.onBMapCallback)
        //     script.onload = script.onreadystatechange = function(){
        //         console.log(33, window, window.onBMapCallback)
        //         resolve(window.BMapGL);
        //     }
        //     // window.onBMapCallback = function () {
        //     //     console.log("百度地图脚本初始化成功...");
        //     //     resolve(BMap);
        //     // };
        //     // 插入script脚本
        // })
    }

    createGMap(){
        console.log('高德地图研发中。。。')
    }

    createTMap(){
        console.log('腾讯地图研发中。。。')
    }

    initBMap(){
        const {
            id='map',
            points = [116.404, 39.915] , 
            areaName, 
            zoom = 10, 
            minZoom = 0,
            maxZoom = 20, 
            enableScrollWheel = true,
            isScaleCtrl = false,
            isZoomCtrl = false
        } = $options
    }
}

function initBMap() {
    // let BMapGL = window.BMapGL ?? window.BMap
    // 通用配置
    const {
        id='map',
        points = [116.404, 39.915] , 
        areaName, 
        zoom = 10, 
        minZoom = 0,
        maxZoom = 20, 
        enableScrollWheel = true,
        isScaleCtrl = false,
        isZoomCtrl = false
        } = $options
    const map = new BMapGL.Map(id); 
    const point = $options.points && points.length === 2 ? new BMapGL.Point(points[0], points[1]) : null;
    map.centerAndZoom(point ?? areaName , zoom);
    // map.setMinZoom(minZoom);
    // map.setMinZoom(maxZoom);
    // console.log(enableScrollWheel)
    map.enableScrollWheelZoom(enableScrollWheel);
    if (isScaleCtrl){
        const scaleCtrl = new BMapGL.ScaleControl();  // 添加比例尺控件
        map.addControl(scaleCtrl);
    }    
    if (isZoomCtrl){
        const zoomCtrl = new BMapGL.ZoomControl();  // 添加缩放控件
        map.addControl(zoomCtrl);
    }
    
    // 轨迹配置
    // map.centerAndZoom(new BMapGL.Point(116.404, 39.915), 11);
    // var p1 = new BMapGL.Point(116.301934,39.977552);
    // var p2 = new BMapGL.Point(116.508328,39.919141);
    // var driving = new BMapGL.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true}});
    // driving.search(p1, p2);

    // 围栏配置

    var circle = new BMapGL.Circle(new BMapGL.Point(116.404, 39.915), 500, {
        strokeColor: 'blue',
        strokeWeight: 2,
        strokeOpacity: 0.5
    });
    map.addOverlay(circle);
}