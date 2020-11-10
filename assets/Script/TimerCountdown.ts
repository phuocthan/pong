import GameController from "./GameController";

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
        this.timerLabel.string = this.matchTime.toString();
        this.lastTimeUpdate = Date.now();
    }

    start () {
        // this.timerLabel = this.node.getComponent(cc.Label);
        // init logic
    }

    onLoad () {
        // this.timerLabel = this.node.getComponent(cc.Label);
        // cc.log(this.timerLabel);
    }

    update () {
        if (this.isStopped) {
            return;
        }
        if( Date.now() - this.lastTimeUpdate > 1000 ) {
            this.matchTime--;
            this.timerLabel.string = this.matchTime.toString();
            this.lastTimeUpdate = Date.now();
            if( this.matchTime == 0 ) {
                GameController.inst.gameOver();
                this.isStopped = true;
                return;
            }
        }
    }
    
    startCount() {

    }


}
