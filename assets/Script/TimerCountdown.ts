import GameController, { SCREEN } from "./GameController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TimerCountdown extends cc.Component {


    matchTime = 120;
    // @property(cc.Label)
    timerLabel: cc.Label = null;
    lastTimeUpdate: number;
    isStopped = false;
    setMatchTime ( value ) {
        if( !this.timerLabel ) {
            this.timerLabel = this.node.getComponent(cc.Label);
        }
        this.matchTime = value;
        // this.timerLabel.string = this.matchTime.toString();
        this.updateTimerLabel(this.matchTime);
        this.lastTimeUpdate = Date.now();
    }

    setMatchTimeInfo(value){
        this.matchTime = value;
        // this.timerLabel.string = this.matchTime.toString();
        this.updateTimerLabel(this.matchTime);
    }

    start () {
        this.timerLabel = this.node.getComponent(cc.Label);
        // init logic
    }

    onLoad () {
        this.timerLabel = this.node.getComponent(cc.Label);
        // cc.log(this.timerLabel);
    }
    updateTimerLabel(time) {
        const minute = Math.floor(time/60);
        const second = time%60; //seconds
        cc.log('time ', time);
        cc.log('minute ', minute);
        cc.log('second ', second);
        const m = minute < 10 ? '0' + minute : '' + minute;
        const s = second < 10 ? '0' + second : '' + second;

        this.timerLabel.string = m + ':' + s;
    }

    update () {
        if (this.isStopped) {
            return;
        }
        if( Date.now() - this.lastTimeUpdate > 1000 ) {
            this.matchTime--;
            // this.timerLabel.string = this.matchTime.toString();
            this.updateTimerLabel(this.matchTime);
            this.lastTimeUpdate = Date.now();
            if( this.matchTime == 0 ) {
                GameController.inst.gameOverNotice();
                GameController.inst.gotoScreen(SCREEN.GAME_OVER);
                this.isStopped = true;
                return;
            }
        }
    }
    
    startCount() {

    }


}
