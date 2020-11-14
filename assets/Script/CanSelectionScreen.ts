import GameController, { SCREEN } from "./GameController";

const { ccclass, property } = cc._decorator;
export enum DATE {
    DAY,
    MONTH,
    YEAR
}
@ccclass
export default class CanSelectionScreen extends cc.Component {

    @property (cc.Sprite)
    selectSkin: cc.Sprite = null;

    private _selectedSkin : number;
    currentSelectSkin = 0;
    public get selectedSkin () {
        return this._selectedSkin;
    }
    public set selectedSkin ( value ) {
        this._selectedSkin = value;
        this.selectSkin.spriteFrame = this.skinList[value];
    }
    skinList = [];
    onLoad () {
        this.skinList = GameController.inst.getSkinList();
        this.selectedSkin = 0;

    }
    clickOnNextBtn () {
        this.currentSelectSkin++;
        if (this.currentSelectSkin == this.skinList.length) {
            this.currentSelectSkin = 0;
        }
        this.selectedSkin =  this.currentSelectSkin;
    }
    clickOnPrevBtn () {
        this.currentSelectSkin--;
        if (this.currentSelectSkin < 0) {
            this.currentSelectSkin = this.skinList.length - 1;
        }
        this.selectedSkin =  this.currentSelectSkin;        
    }
    clickOnChoosePlayerBtn () {
        GameController.inst.gotoScreen( SCREEN.GAME_PLAY );
        GameController.inst.setGameSkins(this.currentSelectSkin);
        GameController.inst.startGameWithClickToPlayScreen();
    }

    // changeSkin ( idex ) {

    // }


}

