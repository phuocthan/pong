import Ball from "./Ball";
import GameController from "./GameController";
import { Utils } from "./Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Paddle extends cc.Component {

    @property
    isPlayer = false;
    moveDirectionY = 0;
    speed = 600;

    // @property
    rgBody: cc.RigidBody = null;
    missDistance: number = 0;
    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';

    start () {
        // init logic
        this.rgBody = this.node.getComponent( cc.RigidBody );
        cc.log( 'this.rgBody ', this.rgBody );
        if( this.isPlayer ) {
            cc.systemEvent.on( cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this );
            cc.systemEvent.on( cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this );
            const _t = this;
            this.node.on( cc.Node.EventType.TOUCH_MOVE, function( event ) {
                let touchEndPos = event.getLocation();
                _t.updatePaddleToPoint( touchEndPos.y )
                cc.log( 'TouchMove ', touchEndPos );
            } );
            this.node.on( cc.Node.EventType.TOUCH_END, function( event ) {
                cc.log( 'TOUCH_END ' );
                _t.moveDirectionY = 0;
            } );
        }
    }

    setSkin(skinFrame){
        const sprite = this.node.getComponent(cc.Sprite);
        sprite.spriteFrame = skinFrame;
    }

    getHeight () {
        return this.node.height * this.node.scale;
    }

    getWidth () {
        return this.node.width * this.node.scale;
    }

    updatePaddleToPoint ( posY ) {
        if( GameController.inst.isGameOver() || !GameController.inst.isGameStart() ) {
            return;
        }
        let wPos = Utils.getWorldPos( this.node );
        wPos.y = posY;
        const size = cc.view.getVisibleSize();
        if( wPos.y - this.getHeight() / 2 < 0 || wPos.y + this.getHeight() / 2 > size.height ) {
            return;
        }
        Utils.setWorldPos( this.node, wPos );
    }

    onKeyDown ( event ) {

        switch( event.keyCode ) {
            case cc.macro.KEY.up:
                this.moveDirectionY = 1;
                break;
            case cc.macro.KEY.down:
                this.moveDirectionY = -1;
                break;
        }
        cc.log( this.moveDirectionY );
    }

    onKeyUp ( event ) {
        this.moveDirectionY = 0;
    }

    InitBotBatch () {
        if( this.isPlayer ) {
            return;
        }
        const ratio = Utils.randomRange(70, 100, true)/100;
        const direction = Utils.randomRange( 0, 1, true ) === 0 ? 1 : -1;
        this.missDistance = Utils.randomRange( this.getHeight() * ratio / 3 , this.getHeight() * ratio * 3 / 5 , true ) * direction;
        
    }

    findDirectionForBOT ( posY, canMiss ) {
          this.moveDirectionY = 0;
            return ;
        if( canMiss ) {
            // const willMiss = Ball.inst.RandomRange( 0, 1, true ) === 0;
            // if( willMiss ) {
            posY += this.missDistance;
            // this.moveDirectionY = 0;
            // return ;
            // }
        }
        let wPos = Utils.getWorldPos( this.node );
        if( Math.abs( wPos.y - posY ) <= 10 ) {
            this.moveDirectionY = 0;
            return;
        }
        this.moveDirectionY = wPos.y > posY ? -1 : 1;
    }
    updateBot () {
        const size = cc.view.getVisibleSize();
        const ballPos = Ball.inst.getWPos();
        if( ballPos.x > size.width / 2 ) {
            this.findDirectionForBOT( size.height / 2, false );
        } else {
            if( !Ball.inst.isBallMovingLeft() )
                this.findDirectionForBOT( ballPos.y, true );
            else {
                this.moveDirectionY = 0;
            }
        }
    }

    update ( dt ) {
        if( GameController.inst.isGameOver() || !GameController.inst.isGameStart() ) {
            return;
        }
        cc.log( 'updateeeeee ' );
        if( !this.isPlayer ) {
            this.updateBot();
        }
        let wordPos = Utils.getWorldPos( this.node );
        const size = cc.view.getVisibleSize();
        wordPos.y += this.moveDirectionY * dt * this.speed;
        if( wordPos.y - this.getHeight() / 2 < 0 || wordPos.y + this.getHeight() / 2 > size.height ) {
            return;
        }
        Utils.setWorldPos( this.node, wordPos );
    }

}
