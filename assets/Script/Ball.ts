import GameController from "./GameController";
import GameControll from "./GameController";
import SoundManager, { AudioClips } from "./SoundManager";
import { Utils } from "./Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Ball extends cc.Component {

    @property
    defaultSpeed = 500;
    speed = 500;
    x_direction = 1;
    y_direction = 1;

    private static _inst: Ball = null;
    firstTimeCollider = true;
    public static get inst (): Ball {
        return Ball._inst;
    }
    public static set inst ( value: Ball ) {
        Ball._inst = value;
    }

    @property
    maxSpeed = 700;

    start () {
        // this.launch();
    }

    onLoad () {
        Ball.inst = this;
    }

    launch () {
        this.node.setPosition( 0, 0 );
        this.node.opacity = 255;
        this.x_direction = Utils.randomRange( 0, 1, true ) === 0 ? -1 : 1;
        this.y_direction = Utils.randomRange( 0, 1, true ) === 0 ? -1 : 1;
        this.firstTimeCollider = true;
        this.speed = this.defaultSpeed;
        GameController.inst.onBallLaunch();

    }

    // public RandomRange ( min: number, max: number, int: boolean = false ) {
    //     // TODO: Change this to use whatever the synchronized random solution

    //     var delta = max - min;
    //     var rnd = Math.random();
    //     var result = min + rnd * delta;

    //     if( int ) {
    //         result = Math.round( result );

    //     }
    //     return result;

    // }

    getWPos () {
        const wPos = Utils.getWorldPos( this.node );
        return wPos;
    }
    update ( dt ) {
        if( GameController.inst.isGameOver() || !GameController.inst.isGameStart() ) {
            return;
        }
        this.node.x += dt * this.speed * this.x_direction;
        this.node.y += dt * this.speed * this.y_direction;
    }

    isBallMovingLeft(){
        return this.x_direction === 1;
    }
    onCollisionEnter ( other, self ) {
        // Left or right wall
        if( other.tag === 2 || other.tag === 3 ) {
            this.x_direction *= -1;
            const isAddScoreForPlayer1 = !(other.tag === 3);
            GameController.inst.setScore( isAddScoreForPlayer1 );
            isAddScoreForPlayer1 ? SoundManager.inst.playSFX(AudioClips.Player_Score_sfx) :  SoundManager.inst.playSFX(AudioClips.AI_Score_sfx);
            this.node.opacity = 0;
            this.reLaunchBall( !isAddScoreForPlayer1 );
            return;
        }
        this.speed += 20;
        if( this.speed > this.maxSpeed ) {
            this.speed = this.maxSpeed;
        }
        // Top or bottom wall
        if( other.tag == 1 ) {
            this.y_direction *= -1;
            SoundManager.inst.playSFX(AudioClips.RoofFloor_sfx)
        }
        // Anything else (in this case, just the paddles)
        if( other.tag == 0 ) {
            SoundManager.inst.playSFX(AudioClips.PaddleHit_sfx)
            this.x_direction *= -1;
            const isRandom = Utils.randomRange(0, 100, true) >= 50;
            if( this.firstTimeCollider || isRandom ) {
                this.firstTimeCollider = false;
                this.y_direction = Utils.randomRange( 0, 1, true ) === 0 ? -1 : 1;
            }
        }

    }
    setSkin(skinFrame){
        const sprite = this.node.getComponent(cc.Sprite);
        sprite.spriteFrame = skinFrame;
    }

    reLaunchBall ( isFromPlayer1 ) {
        this.scheduleOnce( () => {
            this.node.opacity = 255;
            this.speed = this.defaultSpeed;
            GameController.inst.resetPlayersPos();
            const ballSpawnPos = GameController.inst.getBallSpawnPosition( isFromPlayer1 );
            Utils.setWorldPos( this.node, ballSpawnPos );
            this.x_direction = isFromPlayer1 ? -1 : 1;
            this.y_direction = 0;
            this.firstTimeCollider = true;
            GameController.inst.onBallLaunch();
        }, 0.2 );
    }

    hideBall () {
        this.node.opacity = 0;
    }

}
