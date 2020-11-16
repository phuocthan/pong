// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { AudioClips } from "./SoundManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SoundID {

    /**
     *
     */
    _clip : AudioClips;
    _id : number = -1;
    constructor(clip : AudioClips) {
        
        this._clip = clip; 
    }
    setPlayID(id : number)
    {
        this._id = id;
    }
    getClip()
    {
        return this._clip;
    }
    getPlayID()
    {
        return this._id;
    }

    // update (dt) {}
}
