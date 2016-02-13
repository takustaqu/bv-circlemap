/// <reference path="d_ts/jquery.d.ts" />
/// <reference path="d_ts/waa.d.ts" />

if(!Vibrant){
    var Vibrant:any = false;
}


interface Window {
    webkitRequestAnimationFrame(callback: FrameRequestCallback): number;
    mozRequestAnimationFrame(callback: FrameRequestCallback): number;
    Vibrant(el:any ):any;
}

interface Axis {
    x:number;
    y:number;    
}

interface Size {
    w:number;
    h:number;
}

interface ColourRGB {
    r:number;
    g:number;
    b:number;
}

interface Bitt {
    velocity:number;
    translate:Axis;
    color?:ColourRGB;
    type:string;
    props:any;
    scale?:number;
    scaleFx?:number;
    timeshift:number;
    frame:any; //frameごとに実行される関数を定義
    onclick?:any;
    onmousedown?:any;
    onmouseup?:any;
}


interface Options {
    canvasId?:string;
}

class Circlemap {
    
    private _bitts:Bitt[] = [];
    private _canvas:any = false;
    private _ctx:any = false;
    private _touchAreaCanvas:any = false;
    private _touchCtx:any = false;
    private _screenSize:Size = {w:0,h:0};
    private _props:any = {};
    
    private _radkit:any;
    
    private _globalBeatRotate:number = 0;
      
    constructor(options:Options){
        
        var defaultOption = {
            canvasId : "circlemap"
        }
        
        this._radkit =  new Radkit();
        
        
        this._props = {
            cellBaseSize:200,
            cellBeatRailPadding:0
        }
       
       //DOM取得
        this._canvas = <HTMLCanvasElement>document.getElementById(options.canvasId);
        this._ctx = this._canvas.getContext("2d");
        this._touchAreaCanvas = document.createElement("canvas");
        this._touchCtx = this._touchAreaCanvas.getContext("2d");

        
        //canvasのフィット処理
        this.fitCanvasSize();
        this.getCanvasSize();
        
        function bittEffectiveScale(target:Bitt,scalefrom,scaleto){
            var i=0;
            var end =10;
            var timer = setInterval(function(){
                target.scaleFx = ease.easeOutQuart(i,scalefrom,scaleto-scalefrom,end);
                if(i==end) clearInterval(timer);
                i++;
            },1000/60);
        }
        
        //クリックイベント実行
        this._canvas.onmousedown = function(e){
            
            var code = $this.checkObjectIdFromAxis(e.offsetX,e.offsetY);
            var target = $this._bitts[code];
            
            bittEffectiveScale(target,1,0.9);
            
            if(!!target.onmousedown && typeof target.onmousedown == "function"){
                target.onmousedown.call({},target);    
            }
            
        }
        
        this._canvas.ontouchstart = function(e){
            
            var code = $this.checkObjectIdFromAxis(e.offsetX,e.offsetY);
            var target = $this._bitts[code];
            
            bittEffectiveScale(target,1,0.9);
            
            alert("console.log")
            if(!!target.onmousedown && typeof target.onmousedown == "function"){
                target.onmousedown.call({},target);    
            }
            
        }
        
        this._canvas.onmouseup = function(e){
            
            var code = $this.checkObjectIdFromAxis(e.offsetX,e.offsetY);
            var target = $this._bitts[code];
            
            bittEffectiveScale(target,0.9,1);
            
            if(!!target.onmouseup && typeof target.onmouseup == "function"){
                target.onmouseup.call({},target);
            }
            
            if(!!target.onclick && typeof target.onclick == "function"){
                target.onclick.call({},target);    
            }
        }
        
        this._canvas.ontouchend = function(e){
            
            
            var code = $this.checkObjectIdFromAxis(e.offsetX,e.offsetY);
            var target = $this._bitts[code];
            
            bittEffectiveScale(target,0.9,1);
            
            if(!!target.onmouseup && typeof target.onmouseup == "function"){
                target.onmouseup.call({},target);
            }
            
            if(!!target.onclick && typeof target.onclick == "function"){
                target.onclick.call({},target);    
            }
        }
        
        
        //console.log(this._ctx);
        
        var timer:any = false;
        var $this = this;
        
        $(window).resize(function() {
            if (timer !== false) clearTimeout(timer);            
            timer = setTimeout(function() {
                $this.fitCanvasSize();
            }, 200);
        });
        
        var requestAnimationFrame = 
            window.requestAnimationFrame || 
            window.mozRequestAnimationFrame || 
            window.webkitRequestAnimationFrame || 
            window.msRequestAnimationFrame;
            window.requestAnimationFrame = requestAnimationFrame;
        
        // setInterval(function(){
        //     $this.draw();
        // },100);
        
        function drawLoop(){
            $this.draw();
            requestAnimationFrame(drawLoop);
        }
        drawLoop();
        
        
        
        var bpm = 120; 
        var step = ((bpm/8)/60)/4/(1000/60);
        setInterval(function(){
            $this._globalBeatRotate = $this._globalBeatRotate + step;
            if($this._globalBeatRotate > 1){
                $this._globalBeatRotate = 0;
            }
        },1000/60);
        
    }
    
    addBitt(bitt:Bitt):Bitt{
        if(!bitt.frame){}
        
        
        if(!!bitt.props.icon && typeof bitt.props.icon == "string"){
            bitt.props.$icon = document.createElement("img");
            bitt.props.$icon.src = bitt.props.icon;
            
            if(!bitt.props.color && !!Vibrant){
                //Vibrant.jsが有効でかつcolor指定がない場合、画像から自動的に色を取得
                bitt.props.$icon.addEventListener('load', function() {
                    var vibrant = new Vibrant(bitt.props.$icon);
                    var swatches = vibrant.swatches()
                    var rgb = swatches["Vibrant"].getRgb();
                    bitt.color = {
                        r:rgb[0],
                        g:rgb[1],
                        b:rgb[2]
                    }
                });
            } 
        }
        
        
        this._bitts.push(bitt);
        return bitt;
    }
    
    
    /*
    タッチ領域の座標から、対象となるbittのidxを返す。
     */
    checkObjectIdFromAxis(x,y){
        var touchCanvas = this._touchAreaCanvas;
        var w = this._screenSize.w;
        var h = this._screenSize.h;
        var data = this._touchCtx.getImageData(0, 0, w, h).data;
        var i = ((y * w) + x) * 4;
        var r = ("0"+data[i].toString(16)).slice(-2);        
        var g = ("0"+data[i+1].toString(16)).slice(-2);
        var b = ("0"+data[i+2].toString(16)).slice(-2);
        
        return parseInt(r+g+b,16)-1;
    }
   
    
    bittDefaultDraw(bitt:Bitt,ctx:any,centerAxis:Axis,i?:number){
        
        
        var scale = !!bitt.scale ? (bitt.scale) : 1;
        
        if(!!bitt.scaleFx){
            scale = scale * bitt.scaleFx;
        }
        
        var translate = [(bitt.translate.x + centerAxis.x)*(1/scale), (bitt.translate.y + centerAxis.y)*(1/scale)];
            
        ctx.save();
        ctx.scale(scale, scale);
        ctx.translate(translate[0],translate[1]);
        
        var size = this._props.cellBaseSize;
        var sizeHalf = size>>1;
        var ballSize = 12;
        
        //タイムラインの時間を作成(0-1 float);
        var curTime = this._globalBeatRotate + bitt.timeshift;
        
        if(curTime>1){
            curTime = curTime - 1;
        }
        
        var curTime4x = (curTime * 4)%1;
        var curTime8x = (curTime4x * 2)%1;
        
        
        //色を設定
        if(!!bitt.color){
            ctx.strokeStyle = `rgb(${bitt.color.r},${bitt.color.g},${bitt.color.b})`;
            ctx.fillStyle = `rgb(${bitt.color.r},${bitt.color.g},${bitt.color.b})`;
        }else{
            ctx.strokeStyle = "#999";
            ctx.fillStyle = "#999";    
        }
        
        
        //外周の放射エフェクト
        ctx.lineWidth = 2;
        ctx.globalAlpha = 1-ease.linear(curTime4x,0,1,1);
        ctx.beginPath();
            ctx.arc(0, 0, ease.easeOutQuart(curTime4x,sizeHalf,(sizeHalf*0.2),1), 0, Math.PI*2, false);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
            ctx.arc(0, 0, ease.linear(curTime4x,sizeHalf,(sizeHalf*0.2),1), 0, Math.PI*2, false);
        ctx.closePath();
        ctx.stroke();
        ctx.globalAlpha = 1;
        
        
        //アイコンの描画
        ctx.beginPath();
            ctx.arc(0, 0, sizeHalf, 0, Math.PI*2, false);
        ctx.closePath();
        ctx.clip();
        if(!!bitt.props.$icon){
            ctx.drawImage(bitt.props.$icon, sizeHalf*-1, sizeHalf*-1 , size,size);
        }
        ctx.restore();
        
        ctx.save();
        ctx.scale(scale, scale);
        ctx.translate(translate[0],translate[1]);
        
        //色を設定
        if(!!bitt.color){
            ctx.strokeStyle = `rgb(${bitt.color.r},${bitt.color.g},${bitt.color.b})`;
            ctx.fillStyle = `rgb(${bitt.color.r},${bitt.color.g},${bitt.color.b})`;
        }else{
            ctx.strokeStyle = "#999";
            ctx.fillStyle = "#999";    
        }
        
        ctx.lineWidth = 5;
       
       
       //画像の外周 
        ctx.beginPath();
            ctx.arc(0, 0, sizeHalf, 0, Math.PI*2, false);
        ctx.closePath();
        ctx.stroke();
        
        
        this._radkit.setAngle(360-curTime*360);
        var beatPos = this._radkit.getPosition(0,0,sizeHalf  +this._props.cellBeatRailPadding);
        
        ctx.beginPath();
            ctx.arc(beatPos.x, beatPos.y, ballSize, 0, Math.PI*2, false);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
            ctx.arc(beatPos.x, beatPos.y, ballSize*0.6, 0, Math.PI*2, false);
        ctx.closePath();
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = (1-curTime8x)*0.8;   
        ctx.fill();
        ctx.globalAlpha = 1;
        
        ctx.beginPath();
            ctx.arc(beatPos.x, beatPos.y, ease.easeOutQuart(curTime8x,ballSize,ballSize*1,1) , 0, Math.PI*2, false);
        ctx.closePath();
        ctx.globalAlpha = 1-ease.linear(curTime8x,0,1,1);
        ctx.stroke();
        ctx.globalAlpha = 1;
        
        ctx.restore();
        
        /* ### 当たり判定Canvasの処理 ### */
        
        var tCtx = this._touchCtx;
        tCtx.save();
        tCtx.scale(bitt.scale, bitt.scale);
        tCtx.translate(translate[0],translate[1]);
        var col:string = "#"+("00000"+((i+1)*1).toString(16)).slice(-6);
        tCtx.beginPath();
            tCtx.arc(0, 0, sizeHalf, 0, Math.PI*2, false);
        tCtx.closePath();
        tCtx.fillStyle = col;
        tCtx.fill();
        tCtx.restore();
    }
    
    fitCanvasSize(){
        this._canvas.width = $(window).width();
        this._canvas.height = $(window).height();
        
        this._touchAreaCanvas.width = this._canvas.width;
        this._touchAreaCanvas.height = this._canvas.height;
        this.getCanvasSize();
    }
    
    getCanvasSize():Size{
        this._screenSize = {
            w:this._canvas.width,
            h:this._canvas.height
        }
        return this._screenSize;
    }

    
    /**
     * 描画処理
     */
    draw(){
        var ctx = this._ctx;
        
        this.getCanvasSize();
        //中央位置の座標を予め取得
        var center:Axis = {
            x:this._screenSize.w>>1,
            y:this._screenSize.h>>1
        }
        
        //全消去
        ctx.clearRect(0,0,this._screenSize.w,this._screenSize.h);
        
        var $this = this;
        //ビッツを走査
        this._bitts.forEach(function(current,i,array){
            
           $this.bittDefaultDraw(current,ctx,center,i);
           
        });
        
    }
    
} 


