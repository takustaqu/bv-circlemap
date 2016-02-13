/*

Radkit.js by [ow;d]

*/
var Radkit = (function () {
    function Radkit() {
        this._rotate = 0;
        this._cos = false;
        this._sin = false;
        this._angle = 0;
        this._shapeRatio = { x: 1, y: 1 };
        this._rad = 0;
    }
    Radkit.prototype.setAngle = function (angle) {
        this._angle = (angle %= 360);
        this._rad = angle * Math.PI / 180;
        this._cos = Math.cos(this._rad);
        this._sin = Math.sin(this._rad);
        return {
            rad: this._rad,
            cos: this._cos,
            sin: this._sin,
            angle: this._angle
        };
    };
    Radkit.prototype.setShapeRatio = function (w, h) {
        this._shapeRatio = { x: w, y: h };
    };
    Radkit.prototype.getPosition = function (x, y, strength) {
        if (this._cos) {
            return {
                x: this._cos * (strength * this._shapeRatio.y) * -1 + x,
                y: this._sin * (strength * this._shapeRatio.x) + y
            };
        }
        else {
            return false;
        }
    };
    return Radkit;
})();
/// <reference path="d_ts/jquery.d.ts" />
/// <reference path="d_ts/waa.d.ts" />
var Circlemap = (function () {
    function Circlemap(options) {
        this._bitts = [];
        this._canvas = false;
        this._ctx = false;
        this._screenSize = { w: 0, h: 0 };
        this._props = {};
        var defaultOption = {
            canvasId: "circlemap"
        };
        this._props = {
            cellBaseSize: 200,
            cellBeatRailPadding: 10
        };
        this._canvas = document.getElementById(options.canvasId);
        this._ctx = this._canvas.getContext("2d");
        this.getCanvasSize();
        //console.log(this._ctx);
        var timer = false;
        var $this = this;
        $(window).resize(function () {
            if (timer !== false)
                clearTimeout(timer);
            timer = setTimeout(function () {
                $this.fitCanvasSize();
            }, 200);
        });
        setInterval(function () {
            $this.draw();
        }, 100);
    }
    Circlemap.prototype.addBitt = function (bitt) {
        if (!bitt.frame) { }
        if (!!bitt.props.icon && typeof bitt.props.icon == "string") {
            bitt.props.$icon = document.createElement("img");
            bitt.props.$icon.src = bitt.props.icon;
        }
        this._bitts.push(bitt);
        return bitt;
    };
    Circlemap.prototype.bittDefaultDraw = function (bitt, ctx, centerAxis) {
        var translate = [bitt.translate.x + centerAxis.x, bitt.translate.y + centerAxis.y];
        ctx.save();
        ctx.translate(translate[0], translate[1]);
        var size = this._props.cellBaseSize;
        var sizeHalf = size >> 1;
        ctx.beginPath();
        ctx.arc(0, 0, sizeHalf, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.clip();
        if (!!bitt.props.$icon) {
            ctx.drawImage(bitt.props.$icon, sizeHalf * -1, sizeHalf * -1, size, size);
        }
        ctx.restore();
        ctx.save();
        ctx.translate(translate[0], translate[1]);
        ctx.strokeStyle = "#999";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, sizeHalf, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, sizeHalf + this._props.cellBeatRailPadding, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    };
    Circlemap.prototype.fitCanvasSize = function () {
        this._canvas.width = $(window).width();
        this._canvas.height = $(window).height();
        this.getCanvasSize();
    };
    Circlemap.prototype.getCanvasSize = function () {
        this._screenSize = {
            w: this._canvas.width,
            h: this._canvas.height
        };
        return this._screenSize;
    };
    /**
     * 描画処理
     */
    Circlemap.prototype.draw = function () {
        var ctx = this._ctx;
        this.getCanvasSize();
        //中央位置の座標を予め取得
        var center = {
            x: this._screenSize.w >> 1,
            y: this._screenSize.h >> 1
        };
        //全消去
        ctx.clearRect(0, 0, this._screenSize.w, this._screenSize.h);
        var $this = this;
        //ビッツを走査
        this._bitts.forEach(function (current, i, array) {
            $this.bittDefaultDraw(current, ctx, center);
        });
    };
    return Circlemap;
})();
/// <reference path="d_ts/jquery.d.ts" />
/// <reference path="d_ts/waa.d.ts" />
/// <reference path="_radkit.ts" />
/// <reference path="_circlemap.ts" />
