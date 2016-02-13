/// <reference path="d_ts/jquery.d.ts" />
/// <reference path="d_ts/waa.d.ts" />

class SonoMeasure {
    
    private _now:Date;
    private _today:Date;
	private _currentPos:number;
    
    private _fetchTimer:number;
    
    private _bpm:number;
     
    constructor (){
        this._now = new Date();
        this._bpm = 120;
        this._fetchTimer = 0;
        this.refreshToday();
    }
    
    refreshToday(){
        this._today = new Date(`${this._now.getFullYear()}/${this._now.getMonth()+1}/${this._now.getDate()}`);
    }
    
    startFetch(){
        var $this = this;
        this._fetchTimer = setInterval(function(){
            console.log($this.getCurrentBeats());
        },1000/60);
    }
    
    stopFetch(){
        clearInterval(this._fetchTimer);
    }
    
    getCurrentPosition(){
        this._now = new Date();
        return this._now.getTime() - this._today.getTime();
    }
    
    getCurrentBeats(){
        var current = this.getCurrentPosition();
        var beatLength = (1000/(this._bpm/60));
        var fullbeat = Math.floor(current / beatLength);
        var measure = Math.floor(fullbeat / 4);
        var beat = fullbeat % 4;
        var position = current/(24*60*60*1000);
        
        return {
            current:current,
            beatLength:beatLength,
            fullbeat:fullbeat,
            measure:measure,
            beat:beat,
            position:position,
        }
        //
    }
}