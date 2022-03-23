import {initBMap as initBMapFn } from './BMap'
import {initAMap as initAMapFn } from './AMap'
import {initTMap as initTMapFn} from './TMap'
import { optionsTp } from './types/options'

export {optionsTp}
export default class CMap {
    mapAk: string;
    $options: any;
    static wd:any = window || {}
    constructor(options:optionsTp) {
        this.$options = options;
        this.mapAk = '';
        const { type } = options
        if (CMap.wd.$catch && CMap.wd.$catch === type){
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
        const { type } = this.$options;
        this.getMapAK(type);
        (window as any).$catch = type;
        if (type && type === 'TMAP') {
            this.createTMap()
        } else if (type && type === 'AMAP') {
            this.createAMap()
        } else if (type && type === 'BMAP') {
            this.createBMap()
        }
    }
    // 获取地图的ak
    getMapAK(type:string) {
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
        const self = this, wd:any = window || {}
        const {
            drivingPath
        } = this.$options
        
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', 'http://api.map.baidu.com/res/webgl/10/bmap.css');
        document.getElementsByTagName('head')[0].appendChild(link);
        const s = document.createElement('script');
        s.src = `http://api.map.baidu.com/getscript?type=webgl&v=1.0&ak=${self.mapAk}&services=&t=${(new Date).getTime()}`;
        document.body.appendChild(s);
        
        wd.BMapGL_loadScriptTime = (new Date).getTime();
        wd.BMapGL = wd.BMapGL || {};
        wd.BMapGL.apiLoad = function () {
            delete wd.BMapGL.apiLoad;
            if (typeof self.initBMap == "function") {
                self.initBMap()
            }
        };
        if (drivingPath && drivingPath.length >= 2) {
            const trackAnim = document.createElement('script');
            trackAnim.src = `//mapopen.bj.bcebos.com/github/BMapGLLib/TrackAnimation/src/TrackAnimation.min.js`;
            document.body.appendChild(trackAnim);
        }
    }
    // 初始化高德地图 - 加载
    createAMap() {
        console.log('高德')
        const self = this
        const url = `https://webapi.amap.com/maps?v=2.0&key=${self.mapAk}&&plugin=AMap.Scale,AMap.HawkEye,AMap.ToolBar,AMap.MapType`;
        const jsapi = document.createElement('script');
        jsapi.src = url;
        document.body.appendChild(jsapi);
        jsapi.onload = function () {
            console.log(112, window)
            self.initAMap()
        }
    }
    // 初始化腾讯地图 - 加载
    createTMap() {
        const self = this
        const url = `https://map.qq.com/api/gljs?v=1.exp&key=${self.mapAk}`;
        const jsapi = document.createElement('script');
        jsapi.src = url;
        document.body.appendChild(jsapi);
        jsapi.onload = function () {
            self.initTMap()
        }
    }
    // 初始百度地图 - 抹平API操作
    initBMap = initBMapFn

    // 初始化高德地图 - 抹平API操作
    initAMap = initAMapFn
    
    // 初始腾讯德地图 - 抹平API操作
    initTMap = initTMapFn
}