var ease;
(function (ease) {
    ease.linear = function (current, start, dest, duration) { return dest * current / duration + start; };
    ease.easeInOutCubic = function (t, b, c, d) {
        t /= d / 2;
        if (t < 1)
            return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    };
    ease.easeOutQuart = function (t, b, c, d) {
        t /= d;
        t--;
        return -c * (t * t * t * t - 1) + b;
    };
})(ease || (ease = {}));
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
if (!Vibrant) {
    var Vibrant = false;
}
var Circlemap = (function () {
    function Circlemap(options) {
        this._bitts = [];
        this._canvas = false;
        this._ctx = false;
        this._touchAreaCanvas = false;
        this._touchCtx = false;
        this._screenSize = { w: 0, h: 0 };
        this._props = {};
        this._globalBeatRotate = 0;
        var defaultOption = {
            canvasId: "circlemap"
        };
        this._radkit = new Radkit();
        this._props = {
            cellBaseSize: 200,
            cellBeatRailPadding: 0
        };
        //DOM取得
        this._canvas = document.getElementById(options.canvasId);
        this._ctx = this._canvas.getContext("2d");
        this._touchAreaCanvas = document.createElement("canvas");
        this._touchCtx = this._touchAreaCanvas.getContext("2d");
        //canvasのフィット処理
        this.fitCanvasSize();
        this.getCanvasSize();
        function bittEffectiveScale(target, scalefrom, scaleto) {
            var i = 0;
            var end = 10;
            var timer = setInterval(function () {
                target.scaleFx = ease.easeOutQuart(i, scalefrom, scaleto - scalefrom, end);
                if (i == end)
                    clearInterval(timer);
                i++;
            }, 1000 / 60);
        }
        //クリックイベント実行
        this._canvas.onmousedown = function (e) {
            var code = $this.checkObjectIdFromAxis(e.offsetX, e.offsetY);
            var target = $this._bitts[code];
            bittEffectiveScale(target, 1, 0.9);
            if (!!target.onmousedown && typeof target.onmousedown == "function") {
                target.onmousedown.call({}, target);
            }
        };
        this._canvas.ontouchstart = function (e) {
            var code = $this.checkObjectIdFromAxis(e.offsetX, e.offsetY);
            var target = $this._bitts[code];
            bittEffectiveScale(target, 1, 0.9);
            alert("console.log");
            if (!!target.onmousedown && typeof target.onmousedown == "function") {
                target.onmousedown.call({}, target);
            }
        };
        this._canvas.onmouseup = function (e) {
            var code = $this.checkObjectIdFromAxis(e.offsetX, e.offsetY);
            var target = $this._bitts[code];
            bittEffectiveScale(target, 0.9, 1);
            if (!!target.onmouseup && typeof target.onmouseup == "function") {
                target.onmouseup.call({}, target);
            }
            if (!!target.onclick && typeof target.onclick == "function") {
                target.onclick.call({}, target);
            }
        };
        this._canvas.ontouchend = function (e) {
            var code = $this.checkObjectIdFromAxis(e.offsetX, e.offsetY);
            var target = $this._bitts[code];
            bittEffectiveScale(target, 0.9, 1);
            if (!!target.onmouseup && typeof target.onmouseup == "function") {
                target.onmouseup.call({}, target);
            }
            if (!!target.onclick && typeof target.onclick == "function") {
                target.onclick.call({}, target);
            }
        };
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
        var requestAnimationFrame = window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame;
        window.requestAnimationFrame = requestAnimationFrame;
        // setInterval(function(){
        //     $this.draw();
        // },100);
        function drawLoop() {
            $this.draw();
            requestAnimationFrame(drawLoop);
        }
        drawLoop();
        var bpm = 120;
        var step = ((bpm / 8) / 60) / 4 / (1000 / 60);
        setInterval(function () {
            $this._globalBeatRotate = $this._globalBeatRotate + step;
            if ($this._globalBeatRotate > 1) {
                $this._globalBeatRotate = 0;
            }
        }, 1000 / 60);
    }
    Circlemap.prototype.addBitt = function (bitt) {
        if (!bitt.frame) { }
        if (!!bitt.props.icon && typeof bitt.props.icon == "string") {
            bitt.props.$icon = document.createElement("img");
            bitt.props.$icon.src = bitt.props.icon;
            if (!bitt.props.color && !!Vibrant) {
                //Vibrant.jsが有効でかつcolor指定がない場合、画像から自動的に色を取得
                bitt.props.$icon.addEventListener('load', function () {
                    var vibrant = new Vibrant(bitt.props.$icon);
                    var swatches = vibrant.swatches();
                    var rgb = swatches["Vibrant"].getRgb();
                    bitt.color = {
                        r: rgb[0],
                        g: rgb[1],
                        b: rgb[2]
                    };
                });
            }
        }
        this._bitts.push(bitt);
        return bitt;
    };
    /*
    タッチ領域の座標から、対象となるbittのidxを返す。
     */
    Circlemap.prototype.checkObjectIdFromAxis = function (x, y) {
        var touchCanvas = this._touchAreaCanvas;
        var w = this._screenSize.w;
        var h = this._screenSize.h;
        var data = this._touchCtx.getImageData(0, 0, w, h).data;
        var i = ((y * w) + x) * 4;
        var r = ("0" + data[i].toString(16)).slice(-2);
        var g = ("0" + data[i + 1].toString(16)).slice(-2);
        var b = ("0" + data[i + 2].toString(16)).slice(-2);
        return parseInt(r + g + b, 16) - 1;
    };
    Circlemap.prototype.bittDefaultDraw = function (bitt, ctx, centerAxis, i) {
        var scale = !!bitt.scale ? (bitt.scale) : 1;
        if (!!bitt.scaleFx) {
            scale = scale * bitt.scaleFx;
        }
        var translate = [(bitt.translate.x + centerAxis.x) * (1 / scale), (bitt.translate.y + centerAxis.y) * (1 / scale)];
        ctx.save();
        ctx.scale(scale, scale);
        ctx.translate(translate[0], translate[1]);
        var size = this._props.cellBaseSize;
        var sizeHalf = size >> 1;
        var ballSize = 12;
        //タイムラインの時間を作成(0-1 float);
        var curTime = this._globalBeatRotate + bitt.timeshift;
        if (curTime > 1) {
            curTime = curTime - 1;
        }
        var curTime4x = (curTime * 4) % 1;
        var curTime8x = (curTime4x * 2) % 1;
        //色を設定
        if (!!bitt.color) {
            ctx.strokeStyle = "rgb(" + bitt.color.r + "," + bitt.color.g + "," + bitt.color.b + ")";
            ctx.fillStyle = "rgb(" + bitt.color.r + "," + bitt.color.g + "," + bitt.color.b + ")";
        }
        else {
            ctx.strokeStyle = "#999";
            ctx.fillStyle = "#999";
        }
        //外周の放射エフェクト
        ctx.lineWidth = 2;
        ctx.globalAlpha = 1 - ease.linear(curTime4x, 0, 1, 1);
        ctx.beginPath();
        ctx.arc(0, 0, ease.easeOutQuart(curTime4x, sizeHalf, (sizeHalf * 0.2), 1), 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, ease.linear(curTime4x, sizeHalf, (sizeHalf * 0.2), 1), 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.stroke();
        ctx.globalAlpha = 1;
        //アイコンの描画
        ctx.beginPath();
        ctx.arc(0, 0, sizeHalf, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.clip();
        if (!!bitt.props.$icon) {
            ctx.drawImage(bitt.props.$icon, sizeHalf * -1, sizeHalf * -1, size, size);
        }
        ctx.restore();
        ctx.save();
        ctx.scale(scale, scale);
        ctx.translate(translate[0], translate[1]);
        //色を設定
        if (!!bitt.color) {
            ctx.strokeStyle = "rgb(" + bitt.color.r + "," + bitt.color.g + "," + bitt.color.b + ")";
            ctx.fillStyle = "rgb(" + bitt.color.r + "," + bitt.color.g + "," + bitt.color.b + ")";
        }
        else {
            ctx.strokeStyle = "#999";
            ctx.fillStyle = "#999";
        }
        ctx.lineWidth = 5;
        //画像の外周 
        ctx.beginPath();
        ctx.arc(0, 0, sizeHalf, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.stroke();
        this._radkit.setAngle(360 - curTime * 360);
        var beatPos = this._radkit.getPosition(0, 0, sizeHalf + this._props.cellBeatRailPadding);
        ctx.beginPath();
        ctx.arc(beatPos.x, beatPos.y, ballSize, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(beatPos.x, beatPos.y, ballSize * 0.6, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = (1 - curTime8x) * 0.8;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(beatPos.x, beatPos.y, ease.easeOutQuart(curTime8x, ballSize, ballSize * 1, 1), 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.globalAlpha = 1 - ease.linear(curTime8x, 0, 1, 1);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.restore();
        /* ### 当たり判定Canvasの処理 ### */
        var tCtx = this._touchCtx;
        tCtx.save();
        tCtx.scale(bitt.scale, bitt.scale);
        tCtx.translate(translate[0], translate[1]);
        var col = "#" + ("00000" + ((i + 1) * 1).toString(16)).slice(-6);
        tCtx.beginPath();
        tCtx.arc(0, 0, sizeHalf, 0, Math.PI * 2, false);
        tCtx.closePath();
        tCtx.fillStyle = col;
        tCtx.fill();
        tCtx.restore();
    };
    Circlemap.prototype.fitCanvasSize = function () {
        this._canvas.width = $(window).width();
        this._canvas.height = $(window).height();
        this._touchAreaCanvas.width = this._canvas.width;
        this._touchAreaCanvas.height = this._canvas.height;
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
            $this.bittDefaultDraw(current, ctx, center, i);
        });
    };
    return Circlemap;
})();
/// <reference path="d_ts/jquery.d.ts" />
/// <reference path="d_ts/waa.d.ts" />
/// <reference path="_easekit.ts" />
/// <reference path="_radkit.ts" />
/// <reference path="_circlemap.ts" />
