export interface optionsTp {
    id: String, // 配置地图的着陆点  id
    mapAk?: String, // 写入Ak
    poiText?: boolean, //是否显示POI信息
    poiIcon?: boolean, //是否显示POI图标信息
    type?: String, // 设置使用地图的类型 BMAP 百度地图、 TMAP 腾讯、、AMAP 高德
    points?:number[], // 中心点设置 
    areaName?: String, // 中心城市
    zoom?: number, // 缩放级别 
    enableScrollWheel?: boolean, // 开启滚轮
    isScaleCtrl?: boolean, // 添加比例尺控件
    isZoomCtrl?:boolean, // 添加缩放控件
    navi3DCtrl?: boolean, // 添加3D控件
    enclosure?: {
        strokeColor?: String, 
        strokeWeight?: number,
        strokeOpacity?: number, 
        type?: String, // circle 圆形   polygon 多边型
        point?:number[],
        radius?: number,
    },
    drivingPath?: { lng: number; lat: number; }[]
}