/// <reference path="d_ts/jquery.d.ts" />
/// <reference path="d_ts/waa.d.ts" />



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
    axis:Axis;
    color:ColourRGB;
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
      
    constructor(options:Options){
        
        var defaultOption = {
            canvasId : "circlemap"
        }
       
        this._canvas = <HTMLCanvasElement>document.getElementById(options.canvasId);
        this._ctx = this._canvas.getContext("2d");
        
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
        
        setInterval(function(){
            $this.draw();
        },100)
    }
    
    addBitt(bitt:Bitt):Bitt{
        if(!bitt.frame){
            bitt.frame = this.bittDefaultDraw;
        }
        this._bitts.push(bitt);
        return bitt;
    }
    
    bittDefaultDraw(bitt:Bitt,ctx:any,centerAxis:Axis){
        ctx.save();
        ctx.beginPath();

        ctx.arc(centerAxis.x, centerAxis.y, 30, 0, Math.PI*2, false);
        ctx.stroke();        
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
        
        //ビッツを走査
        this._bitts.forEach(function(current,i,array){
           current.frame(current,ctx,center);
        });
        
    }
    
} 