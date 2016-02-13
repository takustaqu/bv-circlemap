// Bloody slow circle packing  with imagemagic http://pastebin.com/N9fg9QuH
   
// forked from peko's "Bubbles on curve" http://jsdo.it/peko/kIoJ
// LINEAR ALGEBRA

function Particle() {  
    this.X = 0;
    this.Y = 0;
    this.Z = 0;
    this.Next;
}

class Matrix4x4{
    
    constructor(){
        
        this.I00 = 1; this.I01 = 0; this.I02 = 0; this.I03 = 0;
        this.I10 = 0; this.I11 = 1; this.I12 = 0; this.I13 = 0;
        this.I20 = 0; this.I21 = 0; this.I22 = 1; this.I23 = 0;
        this.I30 = 0; this.I31 = 0; this.I32 = 0; this.I33 = 1;
    }
    Translation: function(x, y, z) {
    
    var result = new Matrix4x4();
    
    result.I03 = x;
    result.I13 = y;
    result.I23 = z;
    
    return result;
  },
  
  RotationX: function(radiants) {
    
    var result = new Matrix4x4();
    
    var cos = Math.cos(radiants);
    var sin = Math.sin(radiants);
    
    result.I11 = cos;
    result.I12 = -sin;
    result.I21 = sin;
    result.I22 = cos;
    
    return result;
  },
  
  RotationY: function(radiants) {
    
    var result = new Matrix4x4();
    
    var cos = Math.cos(radiants);
    var sin = Math.sin(radiants);
    
    result.I00 = cos;
    result.I02 = -sin;
    result.I20 = sin;
    result.I22 = cos;
    
    return result;
  },
  
  Multiply: function(mtx) {
    
    var result = new Matrix4x4();
    
    result.I00 = this.I00 * mtx.I00 + this.I01 * mtx.I10 + this.I02 * mtx.I20;
    result.I01 = this.I00 * mtx.I01 + this.I01 * mtx.I11 + this.I02 * mtx.I21;
    result.I02 = this.I00 * mtx.I02 + this.I01 * mtx.I12 + this.I02 * mtx.I22;
    result.I03 = this.I00 * mtx.I03 + this.I01 * mtx.I13 + this.I02 * mtx.I23 + this.I03;
    
    result.I10 = this.I10 * mtx.I00 + this.I11 * mtx.I10 + this.I12 * mtx.I20;
    result.I11 = this.I10 * mtx.I01 + this.I11 * mtx.I11 + this.I12 * mtx.I21;
    result.I12 = this.I10 * mtx.I02 + this.I11 * mtx.I12 + this.I12 * mtx.I22;
    result.I13 = this.I10 * mtx.I03 + this.I11 * mtx.I13 + this.I12 * mtx.I23 + this.I13;
    
    result.I20 = this.I20 * mtx.I00 + this.I21 * mtx.I10 + this.I22 * mtx.I20;
    result.I21 = this.I20 * mtx.I01 + this.I21 * mtx.I11 + this.I22 * mtx.I21;
    result.I22 = this.I20 * mtx.I02 + this.I21 * mtx.I12 + this.I22 * mtx.I22;
    result.I23 = this.I20 * mtx.I03 + this.I21 * mtx.I13 + this.I22 * mtx.I23 + this.I23;
    
    result.I30 = this.I30 * mtx.I00 + this.I31 * mtx.I10 + this.I32 * mtx.I20;
    result.I31 = this.I30 * mtx.I01 + this.I31 * mtx.I11 + this.I32 * mtx.I21;
    result.I32 = this.I30 * mtx.I02 + this.I31 * mtx.I12 + this.I32 * mtx.I22;
    result.I33 = this.I30 * mtx.I03 + this.I31 * mtx.I13 + this.I32 * mtx.I23 + this.I33;
    
    return result;
  }
}


var MIMIMUM_BUBBLE_SIZE = 500;

var a1 = [[196,311,1000],[196,254,1000],[142,294,1000],[250,294,1000],[163,357,1000],[229,357,1000],[100,280,1000],[291,280,1000],[196,211,1000],[255,391,1000],[137,392,1000],[175,282,1000],[217,282,1000],[163,322,1000],[229,322,1000],[196,346,1000],[274,418,1000],[323,270,1000],[196,178,1000],[69,270,1000],[117,419,1000],[127,267,1000],[263,267,1000],[115,307,1000],[277,307,1000],[133,362,1000],[217,232,1000],[175,233,1000],[259,361,1000],[167,387,1000],[225,387,1000],[138,334,1000],[257,326,1000],[228,257,1000],[191,373,1000],[154,264,1000],[45,262,1000],[347,262,1000],[289,438,1000],[196,153,1000],[102,440,1000],[312,290,1000],[302,260,1000],[251,414,1000],[180,195,1000],[212,195,1000],[89,260,1000],[79,290,1000],[140,415,1000],[114,396,1000],[277,395,1000],[174,255,1000],[196,289,1000],[242,274,1000],[163,300,1000],[229,300,1000],[242,374,1000],[270,287,1000],[183,329,1000],[209,329,1000],[246,344,1000],[212,370,1000],[196,232,1000],[150,374,1000],[121,287,1000],[281,258,1000],[135,313,1000],[95,303,1000],[118,376,1000],[297,304,1000],[109,257,1000],[158,405,1000],[171,213,987],[273,375,987],[221,212,946],[234,404,946],[300,454,923],[196,134,900],[26,256,894],[365,256,894],[248,256,861],[91,455,861],[156,339,856],[245,312,846],[120,325,846],[159,244,824],[265,343,824],[211,264,808],[190,271,808],[206,387,808],[156,282,800],[181,299,800],[211,299,800],[178,347,800],[214,347,800],[125,346,728],[232,240,722],[61,255,722],[331,255,722],[53,277,722],[339,277,722],[173,371,722],[185,389,722],[292,421,712],[100,422,712],[271,435,712],[120,436,712],[184,165,705],[208,165,705],[139,255,705],[142,276,705],[145,350,705],[213,249,700],[260,308,700],[274,324,700],[227,339,700],[179,178,671],[213,178,671],[329,286,641],[287,408,641],[317,254,632],[63,286,632],[177,313,632],[215,313,632],[104,409,632],[259,428,632],[196,194,600],[74,253,600],[151,311,600],[84,275,585],[307,275,585],[264,404,585],[127,405,585],[131,428,585],[186,358,564],[277,273,540],[203,275,540],[285,294,540],[230,224,512],[162,225,512],[169,336,512],[196,120,500],[209,219,500],[183,220,500],[186,243,500],[123,252,500],[261,252,500],[378,252,500],[168,269,500],[113,272,500],[256,280,500],[232,285,500],[107,293,500],[128,300,500],[102,316,500],[288,317,500],[147,322,500],[242,329,500],[272,354,500],[119,357,500],[244,359,500],[201,360,500],[227,372,500],[257,376,500],[133,377,500],[152,389,500],[240,389,500],[214,397,500],[177,398,500],[83,466,500],[14,252,447],[308,465,447],[227,272,423],[177,360,412],[276,362,400],[221,403,400],[187,143,361],[205,143,361],[206,241,361],[239,248,361],[37,251,361],[149,251,361],[32,266,361],[360,267,361],[178,268,361],[134,283,361],[267,316,361],[109,321,361],[196,325,361],[149,360,361],[179,380,361],[283,383,361],[277,444,361],[224,200,316],[168,201,316],[183,208,316],[209,208,316],[158,232,316],[222,244,316],[270,251,316],[292,251,316],[354,251,316],[263,298,316],[151,329,316],[196,332,316],[166,344,316],[209,357,316],[267,386,316],[125,387,316],[246,401,316],[302,441,316],[89,443,316],[114,445,316],[286,451,316],[209,153,300],[183,154,300],[50,250,300],[98,250,300],[340,250,300],[140,265,300],[100,267,300],[291,267,300],[43,275,300],[349,275,300],[298,291,300],[81,303,300],[310,303,300],[125,335,300],[135,347,300],[163,370,300],[195,386,300],[145,403,300],[171,404,300],[238,416,300],[153,417,300],[299,429,300],[93,430,300],[102,453,300],[173,184,282],[219,184,282],[7,250,282],[185,261,282],[57,266,282],[200,266,282],[335,266,282],[221,268,282],[36,271,282],[356,271,282],[239,288,282],[92,290,282],[324,294,282],[268,332,282],[235,333,282],[216,358,282],[114,364,282],[263,381,282],[108,384,282],[149,396,282],[243,396,282],[289,399,282],[283,427,282],[108,428,282],[139,428,282],[281,448,282],[313,471,282],[196,112,224],[185,148,224],[207,148,224],[185,183,224],[207,183,224],[191,200,224],[201,200,224],[234,230,224],[201,243,224],[82,250,224],[130,250,224],[309,250,224],[385,250,224],[268,256,224],[239,262,224],[182,264,224],[105,269,224],[286,269,224],[162,273,224],[132,278,224],[229,278,224],[67,293,224],[145,306,224],[168,311,224],[223,311,224],[234,311,224],[185,316,224],[207,316,224],[284,323,224],[221,332,224],[206,353,224],[193,360,224],[182,364,224],[128,383,224],[286,387,224],[102,400,224],[271,406,224],[120,407,224],[279,429,224],[112,430,224],[301,434,224],[91,435,224],[110,449,224],[79,472,224],[193,165,200],[197,165,200],[176,171,200],[216,171,200],[190,188,200],[202,188,200],[170,189,200],[222,189,200],[168,195,200],[224,195,200],[182,213,200],[231,216,200],[161,217,200],[190,221,200],[202,221,200],[206,225,200],[186,226,200],[229,231,200],[163,232,200],[169,243,200],[179,244,200],[19,249,200],[42,249,200],[93,249,200],[255,249,200],[297,249,200],[323,249,200],[345,249,200],[349,249,200],[372,249,200],[185,250,200],[130,254,200],[160,254,200],[375,258,200],[77,260,200],[314,261,200],[251,266,200],[312,266,200],[232,268,200],[81,269,200],[90,272,200],[300,272,200],[165,276,200],[78,278,200]];
var colors = ["#CE0071","#A62169","#960052","#E33293","#E359A5",
              "#FFAB00","#CD9728","#B97C00","#FFBE38","#FFCC64",
              "#123EAB","#27438A","#08297C","#3F68D0","#5F7FD0",
              "#9BED00","#8ABF25","#71AC00","#B3F535","#C2F560"];
          
var canvas, context, image, data;

var W = window.innerWidth,
    H = window.innerHeight,
    W2 = W >> 1,
    H2 = H >> 1,
    MAX_INDEX = W * H * 4,
    SHAPE_SCALE = 150.0;

var particles, 
    mouseX  = 0, mouseY  = 0, 
    targetX = 0, targetY = 0, 
	focalLength = 200,
    matrix       = new Matrix4x4(), 
    matrixStatic = new Matrix4x4(),
    translationMatrix = matrixStatic.Translation(0, 0, 10);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
Init();
//loop();
setInterval(loop, 1000/30);
    
function Init() {
    
    container = document.createElement('div');
    document.body.appendChild(container);
    
    canvas = document.createElement("canvas");
    canvas.width  = W;
    canvas.height = H;
    canvas.style.position = "absolute";
    container.appendChild(canvas);
    
    context = canvas.getContext("2d");
    context.fillStyle = 'rgb(0, 0, 0, 0)';
    context.fillRect(0, 0, W, H );

    window.addEventListener('mousemove', onWindowMouseMove, false);
    for (var s=0; s<a1.length; s++) {
    	a1[s][3] = colors[s%colors.length];
	}
}


function loop() {
    
    targetX += ((mouseX-W2)/30.0 - targetX) * 0.1;
    targetY += ((mouseY-H2)/30.0 - targetY) * 0.1;
    
  	matrix = matrixStatic.RotationY(targetX * 0.05).Multiply(matrixStatic.RotationX(targetY * 0.05)).Multiply(translationMatrix);
	context.fillStyle = '#000000';
    context.fillRect(0, 0, W, H);

        for (var s=0; s<a1.length; s++) {
            
            if (a1[s][2] < MIMIMUM_BUBBLE_SIZE) break; // bubble size sort
			
            var x = a1[s][0]-180.0;
            var y = a1[s][1]-300.0;
            var z = 0;
            pz = focalLength + x * matrix.I02 + y * matrix.I12 + z * matrix.I22 + matrix.I32;
            if (0 < pz) {
                
                w = focalLength / pz;
                xi = w * (x * matrix.I00 + y * matrix.I10 + z * matrix.I20) + W2;
                yi = w * (x * matrix.I01 + y * matrix.I11 + z * matrix.I21) + H2;
                zi = w * (x * matrix.I02 + y * matrix.I12 + z * matrix.I22);
				a1[s][4] = xi;
                a1[s][5] = yi;
                a1[s][6] = zi;
			}
        }
	    // no need sort here
    	//a1.sort( function(a,b){ return b[6]-a[6]; } );
        
    	for (var s=0; s<a1.length; s++) {
            
            if (a1[s][2] < MIMIMUM_BUBBLE_SIZE) break; // bubble size sort
            
			var r  = a1[s][2]/100.0;
            var dx = mouseX-a1[s][4];
			var dy = mouseY-a1[s][5];
            var l  = Math.sqrt(dx*dx+dy*dy);
            var e  = Math.sin(Math.exp(-l/40.0)*Math.PI) / l * 20.0;
            context.beginPath();
         	context.arc(a1[s][4] - dx*e, 
                        a1[s][5] - dy*e, 
                        r - a1[s][6] / SHAPE_SCALE * r + e*3, 
                        Math.PI * 2, false);
            context.fillStyle = a1[s][3];  
            context.fill();
        }
}

function onWindowMouseMove(event) {
  
  mouseX = event.clientX;
  mouseY = event.clientY;
  
}