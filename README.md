#### CZMap
- 提供统一的API 实现不同的地图(百度、高德、腾讯)应用 丝滑切换
- 主要实现功能
    - 基础地图展示
    - 路径
    - 围栏
#### 相关API使用id: 
```js
    const options = {
    id: 'map', // 配置地图的着陆点  id
    mapAk: '', // 写入Ak
    poiText: true, //是否显示POI信息 - 仅百度
    poiIcon: true, //是否显示POI图标信息 - 仅百度
    type: 'TMAP', // 设置使用地图的类型 BMAP 百度地图、 TMAP 腾讯、AMAP 高德
    points: [116.307503, 39.984104], // 中心点设置 
    areaName: '上海市', // 中心城市 - 仅百度
    zoom: 11, // 缩放级别 
    enableScrollWheel: false, // 开启滚轮 
    isScaleCtrl: true, // 添加比例尺控件
    isZoomCtrl: true, // 添加缩放控件
    navi3DCtrl: true, // 添加3D控件 
    // drivingType: 'path', // 使用路径搜索展示
    //展示轨迹路线
    drivingPath:[{ 
        'lng': 116.297611,
        'lat': 40.047363
    }, {
        'lng': 116.302839,
        'lat': 40.048219
    }, {
        'lng': 116.308301,
        'lat': 40.050566
    }, {
        'lng': 116.305732,
        'lat': 40.054957
    }, {
        'lng': 116.304754,
        'lat': 40.057953
    }, {
        'lng': 116.306487,
        'lat': 40.058312
    }, {
        'lng': 116.307223,
        'lat': 40.056379
    }],
    // 围栏信息圆形
    enclosure: {  
        strokeColor: "#6699FF",  
        strokeWeight: 2,
        strokeOpacity: 1, 
        // type: 'circle', // circle 圆形   polygon 多边型
        point:[116.387112, 39.920977],
        radius: 2000
    },
    // 围栏信息 多边形
    enclosure: {
        strokeColor: "#6699FF", 
        strokeWeight: 2,
        strokeOpacity: 1, 
        type: 'polygon', // circle 圆形   polygon 多边型
        points:[
            {'lng': 116.387112, 'lat':39.920977},
            {'lng': 116.385243, 'lat':39.913063},
            {'lng': 116.394226, 'lat':39.917988},
            {'lng': 116.401772, 'lat':39.921364},
            {'lng': 116.41248, 'lat':39.927893}
        ]
    }
    }
    const cmap = new CMap(options)
```
#### 深层功能开发
- 插件实例化之后 会有一个map的属性对外暴露了 真实地图的实例 可以是使用 这个数据去做一些 对应地图的功能
#### 参考
- [百度](https://lbsyun.baidu.com/index.php?title=jspopularGL/guide/helloworld)
- [高德](https://lbs.amap.com/api/jsapi-v2/guide/abc/load)
- [腾讯](https://lbs.qq.com/webApi/javascriptGL/glGuide/glOverview)
