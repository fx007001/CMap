export function initAMap (this: any) {
    const AMap = (window as any).AMap || {}
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
            const path = []
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