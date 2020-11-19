import Ball from "./Ball";
import GameAPI from "./GameAPI";
import LeaderBoardScreen from "./LeaderBoardScreen";
import Paddle from "./Paddle";
import TimerCountdown from "./TimerCountdown";
import TouchPlay from "./TouchPlay";
import { Utils } from "./Utils";

const {ccclass, property} = cc._decorator;
const DEFAULT_TIME_MATCH = 30;
export enum SCREEN {
    AGE_GATE,
    GAME_PLAY,
    GAME_OVER,
    CAN_SELECTION,
    LOGIN,
    HOME_SCREEN,
    LEADER_BOARD
}
@ccclass
export default class GameController extends cc.Component {

    @property(cc.Node)
    ageGateScreen: cc.Node = null;
    @property(cc.Node)
    gamePlayScreen: cc.Node = null;
    @property(cc.Node)
    gameOverScreen: cc.Node = null;
    @property(cc.Node)
    canSelectionScreen: cc.Node = null;
    @property(cc.Node)
    loginRegisterScreen: cc.Node = null;
    @property(cc.Node)
    homeScreenScreen: cc.Node = null;
    @property(cc.Node)
    leaderboardScreen: cc.Node = null;

    @property(cc.Label)
    player1_Score: cc.Label = null;
    @property(cc.Label)
    player2_Score: cc.Label = null;
    @property (cc.Node)
    player1Node : cc.Node = null;

    @property (cc.Node)
    player2Node : cc.Node = null;

    @property(TimerCountdown)
    timerCountdown: TimerCountdown = null;
    @property(cc.Label)
    startGameCountdown: cc.Label = null;

    @property(cc.Node)
    gameOverContainer : cc.Node = null;
    @property(cc.Node)
    touchPlay : cc.Node = null;
    @property(cc.Label)
    yourScore: cc.Label = null;
    @property(cc.Label)
    highScoreGameOver: cc.Label = null;

    @property(cc.SpriteFrame)
    PlayerSkins : cc.SpriteFrame[] = [];

    @property(cc.SpriteFrame)
    BallSkins : cc.SpriteFrame[] = [];

    @property(cc.Node)
    clickPlayNode: cc.Node = null;
    @property(cc.Label)
    highScoreLbl: cc.Label = null;

    leaderBoardContent = [];

    birthDate = '';
    isStartCountdown = false;
    _isGameOver = false;
    _isGameStart = false;
    private static _inst: GameController = null;
    startCoundownTimer: number;
    public static get inst (): GameController {
        return GameController._inst;
    }
    public static set inst ( value: GameController ) {
        GameController._inst = value;
    }
    p1Score = 0;
    p2Score = 0;

    highScore = 0;
    playerScore = 0;
    screenList = [];

    gotoScreen(screen) {
        this.screenList.forEach(e => {
            e.active = false;
        })
        this.screenList[screen].active = true;
    }
    updateHighScore(score){
        this.highScore = score;
        this.highScoreLbl.string = '' + score;
        // LeaderBoardScreen.inst.updateLeaderBoard();
    }
    onLoad() {

        GameController.inst = this;
        this.screenList.push(this.ageGateScreen);
        this.screenList.push(this.gamePlayScreen);
        this.screenList.push(this.gameOverScreen);
        this.screenList.push(this.canSelectionScreen);
        this.screenList.push(this.loginRegisterScreen);
        this.screenList.push(this.homeScreenScreen);
        this.screenList.push(this.leaderboardScreen);

        // this.gotoScreen(SCREEN.LOGIN);
        this.gotoScreen(SCREEN.AGE_GATE);

        var manager = cc.director.getCollisionManager();

        manager.enabled = true;
        // manager.enabledDebugDraw = true;
    }
    reset() {
        this.p1Score = this.p2Score = 0;
        this.updateScore();
    }
    updateScore() {
        this.player1_Score.string = this.p1Score.toString();
        this.player2_Score.string = this.p2Score.toString();
    }
    start () {
        // init logic
        // cc.director.getPhysicsManager().enabled = true;
        // cc.director.getCollisionManager().enabled = true;
        // cc.log('Enable Physic')
    }
    setScore(isP1_score) {
        isP1_score ? this.p1Score++ : this.p2Score++;
        this.updateScore();
    }

    setMatchTime(value) {
        this.timerCountdown.setMatchTime(value);
    }
    gameOver(){
        this._isGameOver = true;
        this.resetPlayersPos();
        Ball.inst.hideBall();
        this.yourScore.string = this.p1Score.toString();
        this.gameOverContainer.active = true;
        
    }
    gameOverNotice(){
        this.playerScore = this.p1Score;
        if(this.playerScore > this.highScore) {
            this.updateHighScore(this.playerScore);
        }
        this.yourScore.string = '' + this.playerScore;
        this.highScoreGameOver.string = '' + this.highScore;
        GameAPI.inst.updateYourScore();
    }
    isGameOver() {
        return this._isGameOver;
    }

    isGameStart() {
        return this._isGameStart;
    }

    resetPlayersPos() {
        this.player1Node.y = 0;
        this.player2Node.y = 0;
    }
    getBallSpawnPosition(isPlayer1){
        const node = isPlayer1 ? this.player1Node : this.player2Node;
        const spawnNode = node.getChildByName('StartPoint');
        return Utils.getWorldPos(spawnNode);
    }

    onClickReplayBtn(){
        this.startCountDown()
    }

    getSkinList(){
        return this.PlayerSkins;
    }

    setGameSkins(skin){
        // skins for player
        const p1 = this.player1Node.getComponent(Paddle);
        // let rand = Utils.randomRange(0, this.PlayerSkins.length - 1, true);
        p1.setSkin(this.PlayerSkins[skin]);
        Ball.inst.setSkin(this.BallSkins[skin]);

        const p2 = this.player2Node.getComponent(Paddle);
        let skins = [...this.PlayerSkins];
        skins.splice(skin, 1);

        let rand = Utils.randomRange(0, skins.length - 1, true);

        p2.setSkin(skins[rand]);        

    
    }

    StartGame() {
        // this.randomSkins();
        Ball.inst.launch();
        this._isGameOver = false;
        this._isGameStart = true;
        this.setMatchTime(DEFAULT_TIME_MATCH);
        this.timerCountdown.isStopped = false;
    }

    startCountDown(){
        // this.randomSkins();
        this.isStartCountdown = true;
        this.startCoundownTimer = Date.now();
        this.startGameCountdown.string = 'READY';
        this.startGameCountdown.node.active = true;
        this.touchPlay.active = false;
        // this.gameOverContainer.active = false;
        this.playerScore = this.p1Score = this.p2Score = 0;
        this.updateScore();
        this.resetPlayersPos();
    }

    startGameWithClickToPlayScreen(){
        this.p1Score = this.p2Score = 0;
        this.timerCountdown.setMatchTimeInfo(DEFAULT_TIME_MATCH);
        this.updateScore();
        this.resetPlayersPos();        
        Ball.inst.launch();
        this.touchPlay.active = true;
        this.touchPlay.getComponent(TouchPlay).isSkipped = false;
        this._isGameStart = false;
    }
    update(dt){
        if(!this.isStartCountdown)  {

            return;
        }
        if (Date.now() - this.startCoundownTimer >= 4000){
            this.isStartCountdown = false;
            this.startGameCountdown.node.active = false;
            // this.startGameCountdown.string = '';
            this.StartGame();
        }        
        else if (Date.now() - this.startCoundownTimer >= 3000){
            this.startGameCountdown.string = '1';
        }
        else if (Date.now() - this.startCoundownTimer >= 2000){
            this.startGameCountdown.string = '2';
        }
        else if (Date.now() - this.startCoundownTimer >= 1000){
            this.startGameCountdown.string = '3';
        }                
        
    }

    onBallLaunch() {
        const p1 = this.player1Node.getComponent(Paddle).InitBotBatch();
        const p2 = this.player2Node.getComponent(Paddle).InitBotBatch();
    }



}
