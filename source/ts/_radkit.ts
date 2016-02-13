/*

Radkit.js by [ow;d]

*/



class Radkit {
    
    private _rotate:any;
    private _cos:any;
    private _sin:any;
    private _angle:any;
    private _rad:any;
    private _shapeRatio:any;

    constructor() {
        this._rotate = 0;
        this._cos = false;
        this._sin = false;
        this._angle = 0;
        this._shapeRatio = {x:1,y:1};
        this._rad = 0;
    }    
    
    setAngle(angle){
        this._angle = (angle %= 360);
        this._rad = angle * Math.PI / 180; 
        this._cos = Math.cos(this._rad);
        this._sin = Math.sin(this._rad);
        
        return {
            rad:this._rad,
            cos:this._cos,
            sin:this._sin,
            angle:this._angle
        }
    }
    setShapeRatio(w,h){
        this._shapeRatio = {x:w,y:h};
    }
    
    getPosition(x,y,strength):any{
        if(this._cos){
            return {
                x : this._cos * (strength * this._shapeRatio.y) *-1  + x,
                y : this._sin * (strength * this._shapeRatio.x) + y
            }
        }else{
            return false
        }
    }
    
}






