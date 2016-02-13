module ease {
    export var linear = (current:number,start:number,dest:number,duration:number):number => dest*current/duration + start;
    export var easeInOutCubic = function (t, b, c, d) {
            t /= d/2;
            if (t < 1) return c/2*t*t*t + b;
            t -= 2;
            return c/2*(t*t*t + 2) + b;
        };
        
    export var easeOutQuart = function (t, b, c, d) {
        t /= d;
        t--;
        return -c * (t*t*t*t - 1) + b;
    };
}

