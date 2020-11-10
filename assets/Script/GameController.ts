import Ball from "./Ball";
import Paddle from "./Paddle";
import TimerCountdown from "./TimerCountdown";
import { Utils } from "./Utils";

const {ccclass, property} = cc._decorator;
const DEFAULT_TIME_MATCH = 120;
@ccclass
export default class GameController extends cc.Component {

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

    @property(cc.SpriteFrame)
    PlayerSkins : cc.SpriteFrame[] = [];

    @property(cc.SpriteFrame)
    BallSkins : cc.SpriteFrame[] = [];

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
    // @property(cc.Label)
    // player2_Score: cc.Label = null;
    // @property
    // text: string = 'hello';
    onLoad() {
        GameController.inst = this;
        // cc.director.getPhysicsManager().enabled = true;
        // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        // cc.PhysicsManager.DrawBits.e_pairBit |
        // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        // cc.PhysicsManager.DrawBits.e_jointBit |
        // cc.PhysicsManager.DrawBits.e_shapeBit;

        // cc.director.getCollisionManager().enabled = true;
        // cc.log('Enable Physic')
        this.gameOverContainer.active = false;

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

    randomSkins(){
        // skins for player
        const p1 = this.player1Node.getComponent(Paddle);
        let rand = Utils.randomRange(0, this.PlayerSkins.length - 1, true);
        p1.setSkin(this.PlayerSkins[rand]);
        const p2 = this.player2Node.getComponent(Paddle);
        rand = Utils.randomRange(0, this.PlayerSkins.length - 1, true);
        p2.setSkin(this.PlayerSkins[rand]);        

        rand = Utils.randomRange(0, this.BallSkins.length - 1, true);
        Ball.inst.setSkin(this.BallSkins[rand]);
    
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
        this.randomSkins();
        this.isStartCountdown = true;
        this.startCoundownTimer = Date.now();
        this.startGameCountdown.string = 'READY';
        this.startGameCountdown.node.active = true;
        this.touchPlay.active = false;
        this.gameOverContainer.active = false;
        this.p1Score = this.p2Score = 0;
        this.updateScore();
        this.resetPlayersPos();
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
