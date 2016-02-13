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
        var size = 60;
        var sizeHalf = size >> 1;
        ctx.arc(0, 0, sizeHalf, 0, Math.PI * 2, false);
        ctx.clip();
        if (!!bitt.props.$icon) {
            ctx.drawImage(bitt.props.$icon, sizeHalf * -1, sizeHalf * -1, size, size);
        }
        ctx.restore();
        ctx.save();
        ctx.beginPath();
        ctx.translate(translate[0], translate[1]);
        ctx.arc(0, 0, sizeHalf, 0, Math.PI * 2, false);
        ctx.strokeStyle = "#F00";
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
