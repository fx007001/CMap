class CMap {
    constructor(options) {
        this.$options = options
        this.mapAk = '';
        this.map = ''
        const {
            type
        } = options
        if (window.$catch && window.$catch === type) {
            if (type && type === 'TMAP') {
                this.initTMap()
            } else if (type && type === 'AMAP') {
                this.initAMap()
            } else if (type && type === 'BMAP') {
                this.initBMap()
            }
        } else {
            this.initMap()
        }
    }
    // 初始化地图 
    initMap() {
        const {
            type
        } = this.$options
        window.$catch = type
        this.getMapAK(type)
        if (type && type === 'TMAP') {
            this.createTMap()
        } else if (type && type === 'AMAP') {
            this.createAMap()
        } else if (type && type === 'BMAP') {
            this.createBMap()
        }
    }
    // 获取地图的ak
    getMapAK(type) {
        const {
            mapAk
        } = this.$options
        if (mapAk) {
            this.mapAk = mapAk
        } else {
            switch (type) {
                case 'TMAP': {
                    this.mapAk = 'OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77'
                    break
                }
                case 'AMAP': {
                    this.mapAk = 'c081218aae02057742b9f1a100d6cf66'
                    break
                }
                default: {
                    this.mapAk = 'f7HnzEYGLgOyMyDVTh99ZEQqjlEzuhyC'
                }
            }
        }
    }
    // 初始化百度地图
    createBMap() {
        const self = this
        const {
            drivingPath
        } = this.$options
        window.BMapGL_loadScriptTime = (new Date).getTime();
        window.BMapGL = window.BMapGL || {};
        window.BMapGL.apiLoad = function () {
            delete window.BMapGL.apiLoad;
            if (typeof self.initBMap == "function") {
                self.initBMap()
            }
        };
        const s = document.createElement('script');
        s.src = `http://api.map.baidu.com/getscript?type=webgl&v=1.0&ak=${self.mapAk}&services=&t=${(new Date).getTime()}`;
        document.body.appendChild(s);
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', 'http://api.map.baidu.com/res/webgl/10/bmap.css');
        document.getElementsByTagName('head')[0].appendChild(link);

        if (drivingPath && drivingPath.length >= 2) {
            const trackAnim = document.createElement('script');
            trackAnim.src = `//mapopen.bj.bcebos.com/github/BMapGLLib/TrackAnimation/src/TrackAnimation.min.js`;
            document.body.appendChild(trackAnim);
        }
    }
    // 初始化高德地图
    createAMap() {
        const self = this
        const url = `https://webapi.amap.com/maps?v=2.0&key=${self.mapAk}&&plugin=AMap.Scale,AMap.HawkEye,AMap.ToolBar,AMap.MapType`;
        const jsapi = document.createElement('script');
        jsapi.src = url;
        document.body.appendChild(jsapi);
        jsapi.onload = function () {
            self.initAMap()
        }
    }
    // 初始化腾讯地图
    createTMap() {
        const self = this
        const url = `https://map.qq.com/api/gljs?v=1.exp&key=${self.mapAk}&libraries=geometry`;
        const jsapi = document.createElement('script');
        jsapi.src = url;
        document.body.appendChild(jsapi);
        jsapi.onload = function () {
            self.initTMap()
        }
    }

}
//腾讯地图处理
CMap.prototype.initTMap = function () {
    const wd = window || {}
    const {
        id = 'map',
        points = [39.984104, 116.307503],
        zoom = 10,
        isScaleCtrl = false,
        isZoomCtrl = false,
        navi3DCtrl = false,
        drivingPath = [],
        enclosure = {}
    } = this.$options
    const center = new wd.TMap.LatLng(points[1], points[0])
    const map = new wd.TMap.Map(document.getElementById(id), {
        center, //设置地图中心点坐标
        zoom, //设置地图缩放级别
        // pitch: 43.5, //设置俯仰角
        // rotation: 45 //设置地图旋转角度
    });
    this.map = map
    // 默认是开启的-可以选择关闭
    if (!isZoomCtrl) {
        map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ZOOM);
    }
    /** 控件
     * CONTROL_POSITION 
     * DEFAULT_CONTROL_ID： SCALE 、FLOOR、LOGO、ROTATION、SCALE、ZOOM
     * **/
    if (!isScaleCtrl) {
        map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.SCALE)
    }

    if (!navi3DCtrl) {
        map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ROTATION)
    }
    if (drivingPath && drivingPath.length >= 2){
        let path = [];
        drivingPath.forEach(it => {
            path.push(new TMap.LatLng(it.lat, it.lng))
        })
        const lastPoint = drivingPath.at(-1)
        const startPosition = new TMap.LatLng(drivingPath[0].lat, drivingPath[0].lng);
        const endPosition = new TMap.LatLng(lastPoint.lat, lastPoint.lng);

        new TMap.MultiMarker({
            // 创造MultiMarker显示起终点标记
            id: 'marker-layer',
            map: map,
            styles: {
                start: new TMap.MarkerStyle({
                    width: 25,
                    height: 35,
                    anchor: {
                        x: 16,
                        y: 32
                    },
                    src: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/start.png',
                }),
                end: new TMap.MarkerStyle({
                    width: 25,
                    height: 35,
                    anchor: {
                        x: 16,
                        y: 32
                    },
                    src: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/end.png',
                }),
            },
            geometries: [{
                    id: 'start',
                    styleId: 'start',
                    position: startPosition,
                },
                {
                    id: 'end',
                    styleId: 'end',
                    position: endPosition,
                },
            ],
        });
    
        // 创建 MultiPolyline显示路径折线
        new TMap.MultiPolyline({
            id: 'polyline-layer',
            map: map,
            styles: {
                style_blue: new TMap.PolylineStyle({
                    color: '#3777FF',
                    width: 6,
                    lineCap: 'round',
                }),
            },
            geometries: [{
                id: 'pl_1',
                styleId: 'style_blue',
                paths: path,
            }, ],
        });
       setCenterAndZoom(getAreaAndCent(path))
    }
   
    //多边形区域
    if(enclosure && enclosure.points){
        const { points, radius, strokeColor, strokeWeight } = enclosure
        let path = [];
        points.forEach(it => {
            path.push(new TMap.LatLng(it.lat, it.lng))
        })
        
        new TMap.MultiPolygon({
            id: 'polygon-layer', //图层id
            map: map, //显示多边形图层的底图
            styles: { //多边形的相关样式
                'polygon': new TMap.PolygonStyle({
                    'color': 'rgba(0,125,255,0.3)', //面填充色
                    'showBorder': true, //是否显示拔起面的边线
                    'borderColor': strokeColor || '#6699FF' //边线颜色
                })
            },
            geometries: [{
                'id': 'polygon', //多边形图形数据的标志信息
                'styleId': 'polygon', //样式id
                'paths': path, //多边形的位置信息
                'properties': { //多边形的属性数据
                    'title': 'polygon'
                }
            }]
        });

        setCenterAndZoom(getAreaAndCent(path))
        map.setCenter(path[0])
    }
    // 圆形围栏
    if (enclosure && enclosure.point){
        const { point, radius, strokeColor, strokeWeight } = enclosure
        const TMapCent = new TMap.LatLng(point[1], point[0])
        new TMap.MultiCircle({
            map,
            styles: { // 设置圆形样式
                'circle': new TMap.CircleStyle({
                    'color':'rgba(41,91,255,0.3)',
                    'showBorder': true,
                    'borderColor': strokeColor || 'rgba(41,91,255,1)',
                    'borderWidth': strokeWeight,
                }),
            },
            geometries: [{
                styleId: 'circle',
                center: TMapCent,
                radius,
            }],
        })
        setCenterAndZoom({distance: radius*2, cent:TMapCent})
    }
    

     // 计算最大区域以及 区域中心点
     function getAreaAndCent(path){
        let startPoint = [],
        endPoint = [],
        rt = [],
        lb = [];
        path.forEach(it => {
            if(startPoint[0] === undefined || startPoint[0] < it.lat){
                startPoint[0] = it.lat
            }
            if(startPoint[1] === undefined || startPoint[1] > it.lng){
                startPoint[1] = it.lng
            }
            if(endPoint[0] === undefined || endPoint[0] > it.lat){
                endPoint[0] = it.lat
            }
            if(endPoint[1] === undefined || endPoint[1] < it.lng){
                endPoint[1] = it.lng
            }
            if(rt[0] === undefined || rt[0] < it.lat){
                rt[0] = it.lat
            }
            if(rt[1] === undefined || rt[1] < it.lng){
                rt[1] = it.lng
            }
            if(lb[0] === undefined || lb[0] > it.lat){
                lb[0] = it.lat
            }
            if(lb[1] === undefined || lb[1] > it.lng){
                lb[1] = it.lng
            }
        })
        const pointSE = [
            new TMap.LatLng(startPoint[0], startPoint[1]),
            new TMap.LatLng(endPoint[0], endPoint[1])
        ]
        const distance = TMap.geometry.computeDistance(pointSE);
        var ctpath = [...pointSE,
            new TMap.LatLng(rt[0], rt[1]),
            new TMap.LatLng(lb[0], lb[1]),
        ];
        // 使用百度地图的点位 出现报错
        let cent = ''
        try{
            cent = TMap.geometry.computeCentroid(ctpath);
        } catch {
            cent = undefined
        }
        
        return {distance:distance.toFixed(2), cent}
   }
   // 调整中心点和展示区域
   function setCenterAndZoom(tags){
        const { distance, cent } = tags
        console.log(distance, cent)
        if(cent){
            console.log(2,distance, cent)
            map.setCenter(cent)
        }
        if (distance){
            let comZoom = 10;
            if(distance < 80){
                comZoom = 16;
            } else if (80 < distance &&  distance < 1000){
                comZoom = 15;
            } else if (1000 < distance &&  distance < 3000){
                comZoom = 14;
            } else if (3000 < distance && distance < 7000){
                comZoom = 13;
            } else if (7000 < distance && distance < 15000){
                comZoom = 12;
            } else {
                comZoom = 10;
            }
            map.setZoom(comZoom)
        }
   }
}

CMap.prototype.initAMap = function () {
    const AMap = window.AMap || {}
    const {
        id,
        points = [116.404, 39.915],
        areaName,
        zoom = 10,
        isScaleCtrl = false,
        isZoomCtrl = false,
        navi3DCtrl = false, // 添加3D控件
        enclosure = {},
        drivingType,
        drivingPath = [],
    } = this.$options
    const map = new AMap.Map(id, {
        center: points,
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom
    })
    this.map = map
    if (isScaleCtrl) {
        map.addControl(new AMap.Scale({
            visible: isScaleCtrl
        }))
    }

    if (isZoomCtrl) {
        map.addControl(new AMap.ToolBar({
            visible: isZoomCtrl,
            position: {
                bottom: '60px',
                right: '40px'
            }
        }))
    }

    if (navi3DCtrl) {
        map.addControl(new AMap.MapType());
    }
    // 使用路径搜索展示
    if (drivingType === 'path' && drivingPath.length > 2) {
        AMap.plugin(['AMap.DragRoute'], function () {
            let path = []
            for (let i = 0; i < drivingPath.length; i++) {
                path.push([drivingPath[i].lng, drivingPath[i].lat])
            }
            const route = new AMap.DragRoute(map, path, AMap.DrivingPolicy.LEAST_FEE)
            route.search()
        });
    }
    if (drivingPath && drivingPath.length > 2) {
        // 折线的节点坐标数组，每个元素为 AMap.LngLat 对象
        let path = [

        ];

        for (let i = 0; i < drivingPath.length; i++) {
            path.push(new AMap.LngLat(drivingPath[i].lng, drivingPath[i].lat))
        }
        // console.log()
        // 创建折线实例
        const polyline = new AMap.Polyline({
            path: path,
            strokeColor: "#6699FF",
            strokeWeight: 6,
            strokeOpacity: 0.9,
            zIndex: 50,
            bubble: true,

        });
        const startIcon = new AMap.Icon({
            // 图标尺寸
            size: new AMap.Size(25, 34),
            // 图标的取图地址
            image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
            // 图标所用图片大小
            imageSize: new AMap.Size(135, 40),
            // 图标取图偏移量
            imageOffset: new AMap.Pixel(-9, -3)
        });

        // 将 开始 icon 传入 marker
        const startMarker = new AMap.Marker({
            position: new AMap.LngLat(drivingPath[0].lng, drivingPath[0].lat),
            icon: startIcon,
            offset: new AMap.Pixel(-13, -30)
        });
        // 创建一个 icon
        const endIcon = new AMap.Icon({
            size: new AMap.Size(25, 34),
            image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
            imageSize: new AMap.Size(135, 40),
            imageOffset: new AMap.Pixel(-95, -3)
        });
        const endPint = drivingPath.at(-1)
        // 将 icon 传入 marker
        const endMarker = new AMap.Marker({
            position: new AMap.LngLat(endPint.lng, endPint.lat),
            icon: endIcon,
            offset: new AMap.Pixel(-13, -30)
        });
        map.add(startMarker);
        map.add(polyline);
        map.add(endMarker);
        map.setFitView() // 缩放地图到合适的视野级别
    }
    // 多边形轮廓线的节点坐标数组
    if (enclosure && enclosure.points) {
        const {
            points,
            fillColor = '#6699FF',
            fillOpacity = 0.3,
            strokeColor = '#6699FF',
            borderWeight = 2,
        } = enclosure
        let path = [];
        for (let i = 0; i < points.length; i++) {
            path.push(new AMap.LngLat(points[i].lng, points[i].lat))
        }
        const polygon = new AMap.Polygon({
            path: path,
            fillColor, // 多边形填充颜色
            borderWeight, // 线条宽度，默认为 1
            strokeColor, // 线条颜色
            fillOpacity, // 多边形填充颜色透明度
        });
        map.add(polygon);
        map.setFitView();
    }

    // 圆形
    if (enclosure && enclosure.point) {
        const {
            point,
            radius,
            fillColor = '#6699FF',
            fillOpacity = 0.3,
            strokeColor = '#6699FF',
            strokeWeight = 2,
        } = enclosure
        const circle = new AMap.Circle({
            center: new AMap.LngLat(point[0], point[1]), // 圆心位置
            radius, // 圆半径
            fillColor, // 圆形填充颜色
            fillOpacity,
            strokeColor, // 描边颜色
            strokeWeight, // 描边宽度
        });
        map.add(circle);
        map.setFitView()
    }
}

CMap.prototype.initBMap = function () {
    const {
        id,
        points = [116.404, 39.915],
        areaName,
        poiText = true, //是否显示POI信息 
        poiIcon = true, //是否显示POI图标信息 
        zoom = 10,
        drivingPath = [],
        enableScrollWheel = false,
        isScaleCtrl = false,
        isZoomCtrl = false,
        navi3DCtrl = false, // 添加3D控件
        enclosure = {},
        drivingType
    } = this.$options
    const map = new BMapGL.Map(id);
    this.map = map
    const point = this.$options.points && points.length === 2 ? new BMapGL.Point(points[0], points[1]) : null;
    map.centerAndZoom(point ?? areaName, zoom);
    map.enableScrollWheelZoom(enableScrollWheel);
    map.setDisplayOptions({
        poiText,
        poiIcon
    })
    // 添加3D控件
    if (navi3DCtrl) {
        const ctrl3D = new BMapGL.NavigationControl3D();
        map.addControl(ctrl3D);
    }
    // 添加比例尺控件
    if (isScaleCtrl) {
        const scaleCtrl = new BMapGL.ScaleControl();
        map.addControl(scaleCtrl);
    }
    // 添加缩放控件
    if (isZoomCtrl) {
        const zoomCtrl = new BMapGL.ZoomControl();
        map.addControl(zoomCtrl);
    }

    // 轨迹配置
    if (drivingPath && drivingPath.length >= 2) {
        startPints = [drivingPath[0].lng, drivingPath[0].lat]
        endPints = [drivingPath.at(-1).lng, drivingPath.at(-1).lat]
        // 起始结束点位计算路径
        if (drivingType && drivingType === 'path') {
            const start = new BMapGL.Point(...startPints);
            const end = new BMapGL.Point(...endPints);
            const driving = new BMapGL.DrivingRoute(map, {
                renderOptions: {
                    map: map,
                    autoViewport: true
                }
            });
            driving.search(start, end);
        } else {
            map.centerAndZoom(new BMapGL.Point(...startPints));
            let point = [];
            for (let i = 0; i < drivingPath.length; i++) {
                point.push(new BMapGL.Point(drivingPath[i].lng, drivingPath[i].lat));
            }
            const pl = new BMapGL.Polyline(point, {
                strokeColor: "#6699FF",
                strokeWeight: 6,
            });
            const startIcon = new BMapGL.Icon('//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png', new BMapGL.Size(23, 25));

            const markerST = new BMapGL.Marker(new BMapGL.Point(...startPints), {
                // icon:startIcon,
                name: '起点',
            });
            console.log(markerST.getIcon())
            const markerEND = new BMapGL.Marker(new BMapGL.Point(...endPints), {
                title: '终点'
            });
            setTimeout(function () {
                trackAni = new BMapGLLib.TrackAnimation(map, pl, {
                    overallView: true, // 动画完成后自动调整视野到总览
                    tilt: 30, // 轨迹播放的角度，默认为55
                    duration: 4000, // 动画持续时长，默认为10000，单位ms
                    delay: 300 // 动画开始的延迟，默认0，单位ms
                });
                trackAni.start();
                map.addOverlay(markerST);
                map.addOverlay(markerEND);
            }, 1000);
        }
    }

    // 围栏配置
    if ((enclosure && enclosure.type === 'circle') || enclosure && enclosure.point) {
        const {
            fillColor = "#6699FF",
                fillOpacity = 0.3,
                strokeColor = "#6699FF",
                strokeWeight = 2,
                strokeOpacity = 1,
                point,
                radius
        } = enclosure
        const circle = new BMapGL.Circle(new BMapGL.Point(...point), radius, {
            fillColor,
            fillOpacity,
            strokeColor,
            strokeWeight,
            strokeOpacity,
        });
        map.addOverlay(circle); // 添加到地图中
    } else if (enclosure && enclosure.points || enclosure && enclosure.type === 'polygon') {
        const {
            fillColor = "#6699FF",
                fillOpacity = 0.3,
                strokeColor = "#6699FF",
                strokeWeight = 2,
                strokeOpacity = 1,
                points = []
        } = enclosure
        let pl = []
        for (let i = 0; i < points.length; i++) {
            pl.push(new BMapGL.Point(points[i].lng, points[i].lat))
        }
        const polygon = new BMapGL.Polygon(pl, {
            fillColor,
            fillOpacity,
            strokeColor,
            strokeWeight,
            strokeOpacity
        });
        map.addOverlay(polygon);
    }
}