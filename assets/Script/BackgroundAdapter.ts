const {ccclass, property} = cc._decorator;

@ccclass
export default class BackgroundAdapter extends cc.Component {

    @property
    scaledWidthOnly = false;

    @property
    prioScaleByWidth = false;

    @property(cc.Node)
    dependNode : cc.Node = null;
    // LIFE-CYCLE CALLBACKS:
    start() {
        // this.sprite = this.getComponent(cc.Sprite);

        if (cc.sys.isMobile) {
            window.addEventListener('resize', this.onResized.bind(this));
        } else {
            cc.view.on('canvas-resize', this.onResized, this);
        }

        this.onResized();
    }
    onResized () {

        const size = cc.view.getVisibleSize();

        let currentWidthScale = size.width / 1024   ;  // will change to design screen.
        let currentHeightScale =size.height / 768 ;

        if(this.dependNode){
            currentHeightScale =size.height / 1362 ;
        }

        let currentScale = Math.max(currentWidthScale, currentHeightScale);
        if(this.prioScaleByWidth){
            currentScale =currentWidthScale < currentHeightScale ? currentWidthScale : currentHeightScale ;
        }
        // cc.log('currentScale ',currentScale);
        if(!this.scaledWidthOnly){
            this.node.parent.scaleY = currentScale;
        }
        this.node.parent.scaleX  = currentScale;    
    }
}
