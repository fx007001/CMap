(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
typeof define === 'function' && define.amd ? define(factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.CMap = factory());
})(this, (function () { 'use strict';

function initBMap() {
  var BMapGL = window.BMapGL || {},
      BMapGLLib = window.BMapGLLib || {};
  var _a = this.$options,
      id = _a.id,
      _b = _a.points,
      points = _b === void 0 ? [116.404, 39.915] : _b,
      areaName = _a.areaName,
      _c = _a.poiText,
      poiText = _c === void 0 ? true : _c,
      //是否显示POI信息 
  _d = _a.poiIcon,
      //是否显示POI信息 
  poiIcon = _d === void 0 ? true : _d,
      //是否显示POI图标信息 
  _e = _a.zoom,
      //是否显示POI图标信息 
  zoom = _e === void 0 ? 10 : _e,
      _f = _a.drivingPath,
      drivingPath = _f === void 0 ? [] : _f,
      _g = _a.enableScrollWheel,
      enableScrollWheel = _g === void 0 ? false : _g,
      _h = _a.isScaleCtrl,
      isScaleCtrl = _h === void 0 ? false : _h,
      _j = _a.isZoomCtrl,
      isZoomCtrl = _j === void 0 ? false : _j,
      _k = _a.navi3DCtrl,
      navi3DCtrl = _k === void 0 ? false : _k,
      // 添加3D控件
  _l = _a.enclosure,
      // 添加3D控件
  enclosure = _l === void 0 ? {} : _l,
      drivingType = _a.drivingType;
  var map = new BMapGL.Map(id);
  var point = this.$options.points && points.length === 2 ? new BMapGL.Point(points[0], points[1]) : null;
  map.centerAndZoom(point !== null && point !== void 0 ? point : areaName, zoom);
  map.enableScrollWheelZoom(enableScrollWheel);
  map.setDisplayOptions({
    poiText: poiText,
    poiIcon: poiIcon
  }); // 添加3D控件

  if (navi3DCtrl) {
    var ctrl3D = new BMapGL.NavigationControl3D();
    map.addControl(ctrl3D);
  } // 添加比例尺控件


  if (isScaleCtrl) {
    var scaleCtrl = new BMapGL.ScaleControl();
    map.addControl(scaleCtrl);
  } // 添加缩放控件


  if (isZoomCtrl) {
    var zoomCtrl = new BMapGL.ZoomControl();
    map.addControl(zoomCtrl);
  } // 轨迹配置


  if (drivingPath && drivingPath.length >= 2) {
    var startPints = [drivingPath[0].lng, drivingPath[0].lat];
    var endPints = [drivingPath.at(-1).lng, drivingPath.at(-1).lat]; // 起始结束点位计算路径

    if (drivingType && drivingType === 'path') {
      var start = new BMapGL.Point(startPints[0], startPints[1]);
      var end = new BMapGL.Point(endPints[0], endPints[1]);
      var driving = new BMapGL.DrivingRoute(map, {
        renderOptions: {
          map: map,
          autoViewport: true
        }
      });
      driving.search(start, end);
    } else {
      map.centerAndZoom(new BMapGL.Point(startPints[0], startPints[1]));
      var point_1 = [];

      for (var i = 0; i < drivingPath.length; i++) {
        point_1.push(new BMapGL.Point(drivingPath[i].lng, drivingPath[i].lat));
      }

      var pl_1 = new BMapGL.Polyline(point_1, {
        strokeColor: "#6699FF",
        strokeWeight: 6
      });
      var markerST_1 = new BMapGL.Marker(new BMapGL.Point(startPints[0], startPints[1]), {
        title: '起点'
      });
      var markerEND_1 = new BMapGL.Marker(new BMapGL.Point(endPints[0], endPints[1]), {
        title: '终点'
      });
      setTimeout(function () {
        var trackAni = new BMapGLLib.TrackAnimation(map, pl_1, {
          overallView: true,
          tilt: 30,
          duration: 4000,
          delay: 300 // 动画开始的延迟，默认0，单位ms

        });
        trackAni.start();
        map.addOverlay(markerST_1);
        map.addOverlay(markerEND_1);
      }, 1000);
    }
  } // 围栏配置


  if (enclosure && enclosure.type === 'circle' || enclosure && enclosure.point) {
    var _m = enclosure.fillColor,
        fillColor = _m === void 0 ? "#6699FF" : _m,
        _o = enclosure.fillOpacity,
        fillOpacity = _o === void 0 ? 0.3 : _o,
        _p = enclosure.strokeColor,
        strokeColor = _p === void 0 ? "#6699FF" : _p,
        _q = enclosure.strokeWeight,
        strokeWeight = _q === void 0 ? 2 : _q,
        _r = enclosure.strokeOpacity,
        strokeOpacity = _r === void 0 ? 1 : _r,
        point_2 = enclosure.point,
        radius = enclosure.radius;
    var circle = new BMapGL.Circle(new BMapGL.Point(point_2[0], point_2[1]), radius, {
      fillColor: fillColor,
      fillOpacity: fillOpacity,
      strokeColor: strokeColor,
      strokeWeight: strokeWeight,
      strokeOpacity: strokeOpacity
    });
    map.addOverlay(circle); // 添加到地图中
  } else if (enclosure && enclosure.points || enclosure && enclosure.type === 'polygon') {
    var _s = enclosure.fillColor,
        fillColor = _s === void 0 ? "#6699FF" : _s,
        _t = enclosure.fillOpacity,
        fillOpacity = _t === void 0 ? 0.3 : _t,
        _u = enclosure.strokeColor,
        strokeColor = _u === void 0 ? "#6699FF" : _u,
        _v = enclosure.strokeWeight,
        strokeWeight = _v === void 0 ? 2 : _v,
        _w = enclosure.strokeOpacity,
        strokeOpacity = _w === void 0 ? 1 : _w,
        _x = enclosure.points,
        points_1 = _x === void 0 ? [] : _x;
    var pl = [];

    for (var i = 0; i < points_1.length; i++) {
      pl.push(new BMapGL.Point(points_1[i].lng, points_1[i].lat));
    }

    var polygon = new BMapGL.Polygon(pl, {
      fillColor: fillColor,
      fillOpacity: fillOpacity,
      strokeColor: strokeColor,
      strokeWeight: strokeWeight,
      strokeOpacity: strokeOpacity
    });
    map.addOverlay(polygon);
  }
}

function initAMap() {
  var AMap = window.AMap || {};
  var _a = this.$options,
      id = _a.id,
      _b = _a.points,
      points = _b === void 0 ? [116.404, 39.915] : _b;
      _a.areaName;
      var _c = _a.zoom,
      zoom = _c === void 0 ? 10 : _c,
      _d = _a.isScaleCtrl,
      isScaleCtrl = _d === void 0 ? false : _d,
      _e = _a.isZoomCtrl,
      isZoomCtrl = _e === void 0 ? false : _e,
      _f = _a.navi3DCtrl,
      navi3DCtrl = _f === void 0 ? false : _f,
      // 添加3D控件
  _g = _a.enclosure,
      // 添加3D控件
  enclosure = _g === void 0 ? {} : _g,
      drivingType = _a.drivingType,
      _h = _a.drivingPath,
      drivingPath = _h === void 0 ? [] : _h;
  var map = new AMap.Map(id, {
    center: points,
    resizeEnable: true,
    zoom: zoom
  });

  if (isScaleCtrl) {
    map.addControl(new AMap.Scale({
      visible: isScaleCtrl
    }));
  }

  if (isZoomCtrl) {
    map.addControl(new AMap.ToolBar({
      visible: isZoomCtrl,
      position: {
        bottom: '60px',
        right: '40px'
      }
    }));
  }

  if (navi3DCtrl) {
    map.addControl(new AMap.MapType());
  } // 使用路径搜索展示


  if (drivingType === 'path' && drivingPath.length > 2) {
    AMap.plugin(['AMap.DragRoute'], function () {
      var path = [];

      for (var i = 0; i < drivingPath.length; i++) {
        path.push([drivingPath[i].lng, drivingPath[i].lat]);
      }

      var route = new AMap.DragRoute(map, path, AMap.DrivingPolicy.LEAST_FEE);
      route.search();
    });
  }

  if (drivingPath && drivingPath.length > 2) {
    // 折线的节点坐标数组，每个元素为 AMap.LngLat 对象
    var path = [];

    for (var i = 0; i < drivingPath.length; i++) {
      path.push(new AMap.LngLat(drivingPath[i].lng, drivingPath[i].lat));
    } // console.log()
    // 创建折线实例


    var polyline = new AMap.Polyline({
      path: path,
      strokeColor: "#6699FF",
      strokeWeight: 6,
      strokeOpacity: 0.9,
      zIndex: 50,
      bubble: true
    });
    var startIcon = new AMap.Icon({
      // 图标尺寸
      size: new AMap.Size(25, 34),
      // 图标的取图地址
      image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
      // 图标所用图片大小
      imageSize: new AMap.Size(135, 40),
      // 图标取图偏移量
      imageOffset: new AMap.Pixel(-9, -3)
    }); // 将 开始 icon 传入 marker

    var startMarker = new AMap.Marker({
      position: new AMap.LngLat(drivingPath[0].lng, drivingPath[0].lat),
      icon: startIcon,
      offset: new AMap.Pixel(-13, -30)
    }); // 创建一个 icon

    var endIcon = new AMap.Icon({
      size: new AMap.Size(25, 34),
      image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
      imageSize: new AMap.Size(135, 40),
      imageOffset: new AMap.Pixel(-95, -3)
    });
    var endPint = drivingPath.at(-1); // 将 icon 传入 marker

    var endMarker = new AMap.Marker({
      position: new AMap.LngLat(endPint.lng, endPint.lat),
      icon: endIcon,
      offset: new AMap.Pixel(-13, -30)
    });
    map.add(startMarker);
    map.add(polyline);
    map.add(endMarker);
    map.setFitView(); // 缩放地图到合适的视野级别
  } // 多边形轮廓线的节点坐标数组


  if (enclosure && enclosure.points) {
    var points_1 = enclosure.points,
        _j = enclosure.fillColor,
        fillColor = _j === void 0 ? '#6699FF' : _j,
        _k = enclosure.fillOpacity,
        fillOpacity = _k === void 0 ? 0.3 : _k,
        _l = enclosure.strokeColor,
        strokeColor = _l === void 0 ? '#6699FF' : _l,
        _m = enclosure.borderWeight,
        borderWeight = _m === void 0 ? 2 : _m;
    var path = [];

    for (var i = 0; i < points_1.length; i++) {
      path.push(new AMap.LngLat(points_1[i].lng, points_1[i].lat));
    }

    var polygon = new AMap.Polygon({
      path: path,
      fillColor: fillColor,
      borderWeight: borderWeight,
      strokeColor: strokeColor,
      fillOpacity: fillOpacity
    });
    map.add(polygon);
    map.setFitView();
  } // 圆形


  if (enclosure && enclosure.point) {
    var point = enclosure.point,
        radius = enclosure.radius,
        _o = enclosure.fillColor,
        fillColor = _o === void 0 ? '#6699FF' : _o,
        _p = enclosure.fillOpacity,
        fillOpacity = _p === void 0 ? 0.3 : _p,
        _q = enclosure.strokeColor,
        strokeColor = _q === void 0 ? '#6699FF' : _q,
        _r = enclosure.strokeWeight,
        strokeWeight = _r === void 0 ? 2 : _r;
    var circle = new AMap.Circle({
      center: new AMap.LngLat(point[0], point[1]),
      radius: radius,
      fillColor: fillColor,
      fillOpacity: fillOpacity,
      strokeColor: strokeColor,
      strokeWeight: strokeWeight
    });
    map.add(circle);
    map.setFitView();
  }
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function initTMap() {
  var TMap = window.TMap || {};
  var _a = this.$options,
      _b = _a.id,
      id = _b === void 0 ? 'map' : _b,
      _c = _a.points,
      points = _c === void 0 ? [116.307503, 39.984104] : _c,
      _d = _a.zoom,
      zoom = _d === void 0 ? 10 : _d,
      _e = _a.isScaleCtrl,
      isScaleCtrl = _e === void 0 ? false : _e,
      _f = _a.isZoomCtrl,
      isZoomCtrl = _f === void 0 ? false : _f,
      _g = _a.navi3DCtrl,
      navi3DCtrl = _g === void 0 ? false : _g,
      _h = _a.drivingPath,
      drivingPath = _h === void 0 ? [] : _h,
      _j = _a.enclosure,
      enclosure = _j === void 0 ? {} : _j;
  var center = new TMap.LatLng(points[1], points[0]);
  var map = new TMap.Map(document.getElementById(id), {
    center: center,
    zoom: zoom // pitch: 43.5, //设置俯仰角
    // rotation: 45 //设置地图旋转角度

  }); // 默认是开启的-可以选择关闭

  if (!isZoomCtrl) {
    map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ZOOM);
  }
  /** 控件
   * CONTROL_POSITION
   * DEFAULT_CONTROL_ID： SCALE 、FLOOR、LOGO、ROTATION、SCALE、ZOOM
   * **/


  if (!isScaleCtrl) {
    map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.SCALE);
  }

  if (!navi3DCtrl) {
    map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ROTATION);
  }

  if (drivingPath && drivingPath.length >= 2) {
    var path_1 = [];
    drivingPath.forEach(function (it) {
      path_1.push(new TMap.LatLng(it.lat, it.lng));
    });
    var lastPoint = drivingPath.at(-1);
    var startPosition = new TMap.LatLng(drivingPath[0].lat, drivingPath[0].lng);
    var endPosition = new TMap.LatLng(lastPoint.lat, lastPoint.lng);
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
          src: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/start.png'
        }),
        end: new TMap.MarkerStyle({
          width: 25,
          height: 35,
          anchor: {
            x: 16,
            y: 32
          },
          src: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/end.png'
        })
      },
      geometries: [{
        id: 'start',
        styleId: 'start',
        position: startPosition
      }, {
        id: 'end',
        styleId: 'end',
        position: endPosition
      }]
    }); // 创建 MultiPolyline显示路径折线

    new TMap.MultiPolyline({
      id: 'polyline-layer',
      map: map,
      styles: {
        style_blue: new TMap.PolylineStyle({
          color: '#3777FF',
          width: 6,
          lineCap: 'round'
        })
      },
      geometries: [{
        id: 'pl_1',
        styleId: 'style_blue',
        paths: path_1
      }]
    });
    setCenterAndZoom(getAreaAndCent(path_1));
  } //多边形区域


  if (enclosure && enclosure.points) {
    var points_1 = enclosure.points,
        radius = enclosure.radius,
        strokeColor = enclosure.strokeColor,
        strokeWeight = enclosure.strokeWeight;
    var path_2 = [];
    points_1.forEach(function (it) {
      path_2.push(new TMap.LatLng(it.lat, it.lng));
    });
    new TMap.MultiPolygon({
      id: 'polygon-layer',
      map: map,
      styles: {
        'polygon': new TMap.PolygonStyle({
          'color': 'rgba(0,125,255,0.3)',
          'showBorder': true,
          'borderColor': strokeColor || '#6699FF' //边线颜色

        })
      },
      geometries: [{
        'id': 'polygon',
        'styleId': 'polygon',
        'paths': path_2,
        'properties': {
          'title': 'polygon'
        }
      }]
    });
    setCenterAndZoom(getAreaAndCent(path_2));
    map.setCenter(path_2[0]);
  } // 圆形围栏


  if (enclosure && enclosure.point) {
    var point = enclosure.point,
        radius = enclosure.radius,
        strokeColor = enclosure.strokeColor,
        strokeWeight = enclosure.strokeWeight;
    var TMapCent = new TMap.LatLng(point[1], point[0]);
    new TMap.MultiCircle({
      map: map,
      styles: {
        'circle': new TMap.CircleStyle({
          'color': 'rgba(41,91,255,0.3)',
          'showBorder': true,
          'borderColor': strokeColor || 'rgba(41,91,255,1)',
          'borderWidth': strokeWeight
        })
      },
      geometries: [{
        styleId: 'circle',
        center: TMapCent,
        radius: radius
      }]
    });
    setCenterAndZoom({
      distance: radius * 2,
      cent: TMapCent
    });
  } // 计算最大区域以及 区域中心点


  function getAreaAndCent(path) {
    var startPoint = [],
        endPoint = [],
        rt = [],
        lb = [];
    path.forEach(function (it) {
      if (startPoint[0] === undefined || startPoint[0] < it.lat) {
        startPoint[0] = it.lat;
      }

      if (startPoint[1] === undefined || startPoint[1] > it.lng) {
        startPoint[1] = it.lng;
      }

      if (endPoint[0] === undefined || endPoint[0] > it.lat) {
        endPoint[0] = it.lat;
      }

      if (endPoint[1] === undefined || endPoint[1] < it.lng) {
        endPoint[1] = it.lng;
      }

      if (rt[0] === undefined || rt[0] < it.lat) {
        rt[0] = it.lat;
      }

      if (rt[1] === undefined || rt[1] < it.lng) {
        rt[1] = it.lng;
      }

      if (lb[0] === undefined || lb[0] > it.lat) {
        lb[0] = it.lat;
      }

      if (lb[1] === undefined || lb[1] > it.lng) {
        lb[1] = it.lng;
      }
    });
    var pointSE = [new TMap.LatLng(startPoint[0], startPoint[1]), new TMap.LatLng(endPoint[0], endPoint[1])];
    var distance = TMap.geometry.computeDistance(pointSE);

    var ctpath = __spreadArray(__spreadArray([], pointSE, true), [new TMap.LatLng(rt[0], rt[1]), new TMap.LatLng(lb[0], lb[1])], false); // 使用百度地图的点位 出现报错


    var cent = '';

    try {
      cent = TMap.geometry.computeCentroid(ctpath);
    } catch (_a) {
      cent = undefined;
    }

    return {
      distance: distance.toFixed(2),
      cent: cent
    };
  } // 调整中心点和展示区域


  function setCenterAndZoom(tags) {
    var distance = tags.distance,
        cent = tags.cent;
    console.log(distance, cent);

    if (cent) {
      console.log(2, distance, cent);
      map.setCenter(cent);
    }

    if (distance) {
      var comZoom = 10;

      if (distance < 80) {
        comZoom = 16;
      } else if (80 < distance && distance < 1000) {
        comZoom = 15;
      } else if (1000 < distance && distance < 3000) {
        comZoom = 14;
      } else if (3000 < distance && distance < 7000) {
        comZoom = 13;
      } else if (7000 < distance && distance < 15000) {
        comZoom = 12;
      } else {
        comZoom = 10;
      }

      map.setZoom(comZoom);
    }
  }
}

var CMap =
/** @class */
function () {
  function CMap(options) {
    // 初始百度地图 - 抹平API操作
    this.initBMap = initBMap; // 初始化高德地图 - 抹平API操作

    this.initAMap = initAMap; // 初始腾讯德地图 - 抹平API操作

    this.initTMap = initTMap;
    this.$options = options;
    this.mapAk = '';
    var type = options.type;

    if (CMap.wd.$catch && CMap.wd.$catch === type) {
      if (type && type === 'TMAP') {
        this.initTMap();
      } else if (type && type === 'AMAP') {
        this.initAMap();
      } else if (type && type === 'BMAP') {
        this.initBMap();
      }
    } else {
      this.initMap();
    }
  } // 初始化地图 


  CMap.prototype.initMap = function () {
    var type = this.$options.type;
    this.getMapAK(type);
    window.$catch = type;

    if (type && type === 'TMAP') {
      this.createTMap();
    } else if (type && type === 'AMAP') {
      this.createAMap();
    } else if (type && type === 'BMAP') {
      this.createBMap();
    }
  }; // 获取地图的ak


  CMap.prototype.getMapAK = function (type) {
    var mapAk = this.$options.mapAk;

    if (mapAk) {
      this.mapAk = mapAk;
    } else {
      switch (type) {
        case 'TMAP':
          {
            this.mapAk = 'OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77';
            break;
          }

        case 'AMAP':
          {
            this.mapAk = 'c081218aae02057742b9f1a100d6cf66';
            break;
          }

        default:
          {
            this.mapAk = 'f7HnzEYGLgOyMyDVTh99ZEQqjlEzuhyC';
          }
      }
    }
  }; // 初始化百度地图


  CMap.prototype.createBMap = function () {
    var self = this,
        wd = window || {};
    var drivingPath = this.$options.drivingPath;
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', 'http://api.map.baidu.com/res/webgl/10/bmap.css');
    document.getElementsByTagName('head')[0].appendChild(link);
    var s = document.createElement('script');
    s.src = "http://api.map.baidu.com/getscript?type=webgl&v=1.0&ak=".concat(self.mapAk, "&services=&t=").concat(new Date().getTime());
    document.body.appendChild(s);
    wd.BMapGL_loadScriptTime = new Date().getTime();
    wd.BMapGL = wd.BMapGL || {};

    wd.BMapGL.apiLoad = function () {
      delete wd.BMapGL.apiLoad;

      if (typeof self.initBMap == "function") {
        self.initBMap();
      }
    };

    if (drivingPath && drivingPath.length >= 2) {
      var trackAnim = document.createElement('script');
      trackAnim.src = "//mapopen.bj.bcebos.com/github/BMapGLLib/TrackAnimation/src/TrackAnimation.min.js";
      document.body.appendChild(trackAnim);
    }
  }; // 初始化高德地图 - 加载


  CMap.prototype.createAMap = function () {
    console.log('高德');
    var self = this;
    var url = "https://webapi.amap.com/maps?v=2.0&key=".concat(self.mapAk, "&&plugin=AMap.Scale,AMap.HawkEye,AMap.ToolBar,AMap.MapType");
    var jsapi = document.createElement('script');
    jsapi.src = url;
    document.body.appendChild(jsapi);

    jsapi.onload = function () {
      console.log(112, window);
      self.initAMap();
    };
  }; // 初始化腾讯地图 - 加载


  CMap.prototype.createTMap = function () {
    var self = this;
    var url = "https://map.qq.com/api/gljs?v=1.exp&key=".concat(self.mapAk);
    var jsapi = document.createElement('script');
    jsapi.src = url;
    document.body.appendChild(jsapi);

    jsapi.onload = function () {
      self.initTMap();
    };
  };

  CMap.wd = window || {};
  return CMap;
}();

return CMap;

}));
