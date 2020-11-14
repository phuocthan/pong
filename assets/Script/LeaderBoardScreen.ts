import GameController, { SCREEN } from "./GameController";

const { ccclass, property } = cc._decorator;
@ccclass
export default class LeaderBoardScreen extends cc.Component {

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
    clickOnHomeScreenBtn () {
        GameController.inst.gotoScreen( SCREEN.HOME_SCREEN );
        // GameController.inst.startGameWithClickToPlayScreen();
    }



}

