import GameAPI from "./GameAPI";
import GameController, { SCREEN } from "./GameController";
import LeaderBoardScreen from "./LeaderBoardScreen";
import SoundManager, { AudioClips } from "./SoundManager";

const { ccclass, property } = cc._decorator;
export enum DATE {
    DAY,
    MONTH,
    YEAR
}
@ccclass
export default class HomeScreenController extends cc.Component {

    @property( cc.EditBox )
    boxEmail: cc.EditBox = null;

    @property( cc.EditBox )
    boxPassword: cc.EditBox = null;

    @property( cc.Label )
    highScore: cc.Label = null;

    @property( cc.Node )
    signInNode: cc.Node = null;

    @property( cc.Node )
    signUpNode: cc.Node = null;

    @property( cc.Node )
    soundSprite: cc.Node = null;

    @property( cc.Sprite )
    soundBtnSprite: cc.Sprite = null;

    @property( cc.SpriteFrame )
    soundSpriteFrame: cc.SpriteFrame[] = [];
    isTurnedOnSound = true;
    // inputList: boolean[];
    clickOnSoundButton() {
        this.isTurnedOnSound = !this.isTurnedOnSound;
        this.soundBtnSprite.spriteFrame = this.isTurnedOnSound ? this.soundSpriteFrame[0] : this.soundSpriteFrame[1];
        // if(this.isTurnedOnSound) {
        //     this.soundSpriteFrame[0];

            
        // }
        SoundManager.inst.enabledSound(this.isTurnedOnSound);
    }
    onLoad () {
        // this.inputList = [false, false, false];
        // this.gotoScreen(true);
    }
    // gotoScreen(isLogin){
    //     this.signInNode.active = isLogin;
    //     this.signUpNode.active = !isLogin;
    // }

    updateHighScore (score) {
        this.highScore.string = '' + score;
    }
    clickOnPlayBtn () {
        SoundManager.inst.playSFX(AudioClips.BtnClick_sfx);
        GameController.inst.gotoScreen( SCREEN.CAN_SELECTION );
    }
    clickOnLeaderBoardBtn () {
        SoundManager.inst.playSFX(AudioClips.BtnClick_sfx);
        // GameAPI.getInstance().getLeaderBoards();
        GameController.inst.gotoScreen(SCREEN.LEADER_BOARD);
        LeaderBoardScreen.inst.updateLeaderBoard();
    }
    clickOnLogOutBtn () {
        SoundManager.inst.playSFX(AudioClips.BtnClick_sfx);
        GameController.inst.gotoScreen(SCREEN.LOGIN);
    }
    



}

