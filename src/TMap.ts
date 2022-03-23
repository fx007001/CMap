export function initTMap(this: any) {
    const TMap = (window as any).TMap || {}
    const {
        id = 'map',
        points = [116.307503, 39.984104],
        zoom = 10,
        isScaleCtrl = false,
        isZoomCtrl = false,
        navi3DCtrl = false,
        drivingPath = [],
        enclosure = {}
    } = this.$options
    const center = new TMap.LatLng(points[1], points[0])
    const map = new TMap.Map(document.getElementById(id), {
        center, //设置地图中心点坐标
        zoom, //设置地图缩放级别
        // pitch: 43.5, //设置俯仰角
        // rotation: 45 //设置地图旋转角度
    });
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
        points.forEach((it:any) => {
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
     function getAreaAndCent(path: any){
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