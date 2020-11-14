import GameController, { SCREEN } from "./GameController";

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
    // inputList: boolean[];

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
        GameController.inst.gotoScreen( SCREEN.CAN_SELECTION );
    }
    clickOnLeaderBoardBtn () {
        GameController.inst.gotoScreen( SCREEN.LEADER_BOARD );
    }
    clickOnLogOutBtn () {
        // GameController.inst.gotoScreen(SCREEN.LEADER_BOARD);
    }



}

