import GameAPI from "./GameAPI";
import GameController, { SCREEN } from "./GameController";
import SoundManager, { AudioClips } from "./SoundManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class GameOverController extends cc.Component {

    // @property( cc.EditBox )
    // boxEmail: cc.EditBox = null;

    // @property( cc.EditBox )
    // boxPassword: cc.EditBox = null;

    // @property( cc.Label )
    // highScore: cc.Label = null;

    // @property( cc.Node )
    // signInNode: cc.Node = null;

    // @property( cc.Node )
    // signUpNode: cc.Node = null;
    // inputList: boolean[];

    onLoad () {
        // this.inputList = [false, false, false];
        // this.gotoScreen(true);
    }
    // gotoScreen(isLogin){
    //     this.signInNode.active = isLogin;
    //     this.signUpNode.active = !isLogin;
    // }
    clickOnReplayBtn () {
        SoundManager.inst.playSFX(AudioClips.BtnClick_sfx);
        GameController.inst.gotoScreen( SCREEN.GAME_PLAY );
        GameController.inst.startGameWithClickToPlayScreen();
    }
    clickOnLeaderBoardBtn () {
        SoundManager.inst.playSFX(AudioClips.BtnClick_sfx);
        GameAPI.getInstance().getLeaderBoards();
        // GameController.inst.gotoScreen( SCREEN.LEADER_BOARD );
    }



}

