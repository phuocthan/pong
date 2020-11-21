import GameController, { SCREEN } from "./GameController";
import SoundManager, { AudioClips } from "./SoundManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class LeaderBoardScreen extends cc.Component {

    @property( cc.Label )
    yourBest: cc.Label = null;
     
    @property(cc.Node)
    topTen: cc.Node[] = [];
    updateLeaderBoard(){
        this.yourBest.string = '' + GameController.inst.highScore;
        const lb = GameController.inst.leaderBoardContent;
        const size = this.topTen.length;
        lb.sort((a, b) => b.highScore - a.highScore);
        this.topTen.forEach((e, i) => {
            e.getChildByName('rank').getComponent(cc.Label).string = (i+1) +'.';
            if(lb[i]) {
                e.active = true;
                e.getChildByName('name').getComponent(cc.Label).string = lb[i].username;
                e.getChildByName('Score').getComponent(cc.Label).string = lb[i].highScore || 0;
            }
            else{
                e.active = false;
            }
        })        
    }

    private static _inst: LeaderBoardScreen = null;
    public static get inst (): LeaderBoardScreen {
        return LeaderBoardScreen._inst;
    }
    public static set inst ( value: LeaderBoardScreen ) {
        LeaderBoardScreen._inst = value;
    }
    // public static getInstance(): LeaderBoardScreen {
    //     if (!LeaderBoardScreen.inst) {
    //         LeaderBoardScreen.inst = new LeaderBoardScreen();
    //     }
    //     return LeaderBoardScreen.inst;
    // };       
    onLoad () {
        LeaderBoardScreen.inst = this;
        // this.yourBest.string = '' + GameController.inst.highScore;
        // const lb = GameController.inst.leaderBoardContent;
        // const size = this.topTen.length;
        // lb.sort((a, b) => b.highScore - a.highScore);
        // this.topTen.forEach((e, i) => {
        //     e.getChildByName('rank').getComponent(cc.Label).string = (i+1) +'.';
        //     e.getChildByName('name').getComponent(cc.Label).string = lb[i].username;
        //     e.getChildByName('Score').getComponent(cc.Label).string = lb[i].highScore;
        // })
    }
    clickOnHomeScreenBtn () {
        SoundManager.inst.playSFX(AudioClips.BtnClick_sfx);
        GameController.inst.gotoScreen( SCREEN.HOME_SCREEN );
    }



}

