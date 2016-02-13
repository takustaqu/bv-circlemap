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
    timeshift:number;
    frame:any; //frameごとに実行される関数を定義
}


interface Options {
    canvasId?:string;
}

class Circlemap {
    
    private _bitts:Bitt[] = [];
    private _canvas:any = false;
    private _ctx:any = false;
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
            cellBeatRailPadding:16
        }
       
        this._canvas = <HTMLCanvasElement>document.getElementById(options.canvasId);
        this._ctx = this._canvas.getContext("2d");
        
        this.fitCanvasSize();
        this.getCanvasSize();
        
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
        
        
        
        
        setInterval(function(){
            $this._globalBeatRotate = $this._globalBeatRotate + (1/360);
            if($this._globalBeatRotate > 1){
                $this._globalBeatRotate = 0;
            }
        },10)
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
    
    bittDefaultDraw(bitt:Bitt,ctx:any,centerAxis:Axis){
        
        var translate = [bitt.translate.x + centerAxis.x, bitt.translate.y + centerAxis.y]
            
        ctx.save();
        
        
        ctx.translate(translate[0],translate[1]);
        
        var size = this._props.cellBaseSize;
        var sizeHalf = size>>1;
        
        var curTime = this._globalBeatRotate + bitt.timeshift;
        
        if(curTime>1){
            curTime = curTime - 1;
        }
        
        var curTime4x = (curTime * 4)%1;
        
        
        //色を設定
        if(!!bitt.color){
            ctx.strokeStyle = `rgb(${bitt.color.r},${bitt.color.g},${bitt.color.b})`;
            ctx.fillStyle = `rgb(${bitt.color.r},${bitt.color.g},${bitt.color.b})`;
        }else{
            ctx.strokeStyle = "#999";
            ctx.fillStyle = "#999";    
        }
        
        
        //ビート表示のレール部
        ctx.lineWidth = 2;
        ctx.beginPath();
            ctx.arc(0, 0, ease.easeOutQuart(curTime4x,sizeHalf,(sizeHalf*0.5),1), 0, Math.PI*2, false);
        ctx.closePath();
        ctx.globalAlpha = 1-curTime4x;
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
        ctx.translate(translate[0],translate[1]);
        
        //色を設定
        if(!!bitt.color){
            ctx.strokeStyle = `rgb(${bitt.color.r},${bitt.color.g},${bitt.color.b})`;
            ctx.fillStyle = `rgb(${bitt.color.r},${bitt.color.g},${bitt.color.b})`;
        }else{
            ctx.strokeStyle = "#999";
            ctx.fillStyle = "#999";    
        }
        
        ctx.lineWidth = 3;
       
       
       //画像の外周 
        ctx.beginPath();
            ctx.arc(0, 0, sizeHalf, 0, Math.PI*2, false);
        ctx.closePath();
        ctx.stroke();
        
       //ビート表示のレール部
       ctx.lineWidth = 1;
        ctx.beginPath();
            ctx.arc(0, 0, sizeHalf+this._props.cellBeatRailPadding, 0, Math.PI*2, false);
        ctx.closePath();
        ctx.globalAlpha = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
        
        
        this._radkit.setAngle(360-curTime*360);
        var beatPos = this._radkit.getPosition(0,0,sizeHalf  +this._props.cellBeatRailPadding);
        
        ctx.beginPath();
            ctx.arc(beatPos.x, beatPos.y, 8, 0, Math.PI*2, false);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
    
    fitCanvasSize(){
        this._canvas.width = $(window).width();
        this._canvas.height = $(window).height();
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
            
           $this.bittDefaultDraw(current,ctx,center);
           
        });
        
    }
    
} 


