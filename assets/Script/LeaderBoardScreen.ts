import GameController, { SCREEN } from "./GameController";
import SoundManager, { AudioClips } from "./SoundManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class LeaderBoardScreen extends cc.Component {

    @property( cc.Label )
    yourBest: cc.Label = null;
    
    @property(cc.Node)
    topTen: cc.Node[] = [];

    onLoad () {
        this.yourBest.string = '' + GameController.inst.highScore;
        const lb = GameController.inst.leaderBoardContent;
        const size = this.topTen.length;
        lb.sort((a, b) => b.highScore - a.highScore);
        this.topTen.forEach((e, i) => {
            e.getChildByName('rank').getComponent(cc.Label).string = (i+1) +'.';
            e.getChildByName('name').getComponent(cc.Label).string = lb[i].username;
            e.getChildByName('Score').getComponent(cc.Label).string = lb[i].highScore;
        })
    }
    clickOnHomeScreenBtn () {
        SoundManager.inst.playSFX(AudioClips.BtnClick_sfx);
        GameController.inst.gotoScreen( SCREEN.HOME_SCREEN );
    }



}

