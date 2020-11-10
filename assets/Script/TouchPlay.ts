import GameController from "./GameController";
import GameControll from "./GameController";
import { Utils } from "./Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TouchPlay extends cc.Component {

    isSkipped = false;
    onLoad() {
        
        cc.systemEvent.on( cc.SystemEvent.EventType.KEY_DOWN, this.skip.bind(this), this );
        this.node.on( cc.Node.EventType.TOUCH_START, this.skip.bind(this));

    }
    skip(){
        if(this.isSkipped) {
            return;
        }
        this.isSkipped = true;
        cc.log('Touch or KEY');
        GameController.inst.startCountDown();
    }
}
