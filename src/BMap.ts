export function initBMap(this: any) {
    const BMapGL = (window as any).BMapGL || {},
    BMapGLLib = (window as any).BMapGLLib || {}
    const {
        id,
        points = [116.404, 39.915],
        areaName,
        poiText = true,         //是否显示POI信息 
        poiIcon = true,         //是否显示POI图标信息 
        zoom = 10,
        drivingPath = [],
        enableScrollWheel = false,
        isScaleCtrl = false,
        isZoomCtrl = false,
        navi3DCtrl = false,     // 添加3D控件
        enclosure = {},
        drivingType
    } = this.$options
    const map = new BMapGL.Map(id);
    const point = this.$options.points && points.length === 2 ? new BMapGL.Point(points[0], points[1]) : null;
    map.centerAndZoom(point ?? areaName, zoom);
    map.enableScrollWheelZoom(enableScrollWheel);
    map.setDisplayOptions({
        poiText,
        poiIcon
    })
    // 添加3D控件
    if (navi3DCtrl){
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
        const startPints = [drivingPath[0].lng, drivingPath[0].lat]
        const endPints = [drivingPath.at(-1).lng, drivingPath.at(-1).lat]
        // 起始结束点位计算路径
        if (drivingType && drivingType === 'path') {
            const start = new BMapGL.Point(startPints[0], startPints[1]);
            const end = new BMapGL.Point(endPints[0], endPints[1]);
            const driving = new BMapGL.DrivingRoute(map, {
                renderOptions: {
                    map: map,
                    autoViewport: true
                }
            });
            driving.search(start, end);
        } else {
            map.centerAndZoom(new BMapGL.Point(startPints[0], startPints[1]));
            let point = [];
            for (let i = 0; i < drivingPath.length; i++) {
                point.push(new BMapGL.Point(drivingPath[i].lng, drivingPath[i].lat));
            }
            const pl = new BMapGL.Polyline(point, {
                strokeColor: "#6699FF",
                strokeWeight: 6,
            });
            const markerST = new BMapGL.Marker(new BMapGL.Point(startPints[0], startPints[1]), {
                title: '起点'
            });
            const markerEND = new BMapGL.Marker(new BMapGL.Point(endPints[0],endPints[1]), {
                title: '终点'
            });
            setTimeout(function () {
                const trackAni = new BMapGLLib.TrackAnimation(map, pl, {
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
        const circle = new BMapGL.Circle(new BMapGL.Point(point[0],point[1]), radius, {
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