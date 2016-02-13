/// <reference path="d_ts/jquery.d.ts" />
/// <reference path="d_ts/waa.d.ts" />
var Circlemap = (function () {
    function Circlemap(options) {
        this._bitts = [];
        this._canvas = false;
        this._ctx = false;
        this._screenSize = { w: 0, h: 0 };
        var defaultOption = {
            canvasId: "circlemap"
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
        if (!bitt.frame) {
            bitt.frame = this.bittDefaultDraw;
        }
        this._bitts.push(bitt);
        return bitt;
    };
    Circlemap.prototype.bittDefaultDraw = function (bitt, ctx, centerAxis) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerAxis.x, centerAxis.y, 30, 0, Math.PI * 2, false);
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
        //ビッツを走査
        this._bitts.forEach(function (current, i, array) {
            current.frame(current, ctx, center);
        });
    };
    return Circlemap;
})();
