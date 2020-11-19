import GameAPI from "./GameAPI";
import GameController, { SCREEN } from "./GameController";
import SoundManager, { AudioClips } from "./SoundManager";

const { ccclass, property } = cc._decorator;
export enum DATE {
    DAY,
    MONTH,
    YEAR
}
@ccclass
export default class LoginController extends cc.Component {

    @property( cc.EditBox )
    boxEmail: cc.EditBox = null;

    @property( cc.EditBox )
    boxPassword: cc.EditBox = null;

    @property( cc.Label )
    errorLoginLabel: cc.Label = null;
    @property( cc.Label )
    errorLoguplabel: cc.Label = null;

    @property( cc.Label )
    successLabel: cc.Label = null;

    @property( cc.Node )
    signInNode: cc.Node = null;

    @property( cc.Node )
    signUpNode: cc.Node = null;
    // inputList: boolean[];

    @property( cc.EditBox )
    inputUserName: cc.EditBox = null;

    @property( cc.EditBox )
    inputEmail: cc.EditBox = null;

    @property( cc.EditBox )
    inputPassword: cc.EditBox = null;

    @property( cc.EditBox )
    inputCPassword: cc.EditBox = null;

    @property( cc.EditBox )
    loginEmail: cc.EditBox = null;

    @property( cc.EditBox )
    loginPassword: cc.EditBox = null;

    @property( cc.Label )
    logUpError: cc.Label = null;
    public static inst : LoginController = null;
    curToken = null;
    public static getInstance(): LoginController {
        if (!LoginController.inst) {
            LoginController.inst = new LoginController();
        }
        return LoginController.inst;
    };   
    onLoad () {
        // this.inputList = [false, false, false];
        this.hideAPIError();
        this.gotoScreen( true );
        LoginController.inst = this;
    }
    gotoScreen ( isLogin ) {
        this.signInNode.active = isLogin;
        this.signUpNode.active = !isLogin;
    }
    clickOnLoginBtn () {
        this.hideAPIError();
        SoundManager.inst.playSFX( AudioClips.BtnClick_sfx );
        // GameController.inst.gotoScreen( SCREEN.HOME_SCREEN );
        const params = {
            "email": this.loginEmail.string,
            "password": this.loginPassword.string,
        };
        cc.log( 'login info ', params );
        GameAPI.getInstance().login(params);
    }
    clickOnSignUpHereBtn () {
        this.hideAPIError();
        SoundManager.inst.playSFX( AudioClips.BtnClick_sfx );
        this.gotoScreen( false );
        // GameController.inst.gotoScreen(SCREEN.HOME_SCREEN);
    }

    clickOnSignUpBtn () {
        this.hideAPIError();
        SoundManager.inst.playSFX( AudioClips.BtnClick_sfx );
        // this.gotoScreen(true);
        const params = {
            "email": this.inputEmail.string,
            "password": this.inputPassword.string,
            "confirmPassword": this.inputCPassword.string,
            "username": this.inputUserName.string,
            "birthday": GameController.inst.birthDate,
        };
        cc.log( 'sign up info ', params );
        GameAPI.getInstance().register(params);


        // GameController.inst.gotoScreen(SCREEN.HOME_SCREEN);
    }
    
    hideAPIError (){
        this.errorLoginLabel.enabled = false;
        this.errorLoginLabel.string = '';
        this.errorLoguplabel.enabled = false;
        this.errorLoguplabel.string = '';            
    }

    showAPIError (islogin ,text: string){
        let newTxt = '';
        if (text.indexOf('empty') != -1) {
            newTxt = 'Please input missing fields';
        }
        else if (text.indexOf('incorrect') != -1) {
            newTxt = 'Email or password incorrect';
        }
        else if (text.indexOf('6 characters') != -1) {
            newTxt = 'Password must be at least 6 characters';
        }
        else if (text.indexOf('must be [ref:password]') != -1) {
            newTxt = 'Password doesn\'t match';
        }
        else if (text.indexOf('already taken') != -1 && text.indexOf('Email') != -1) {
            newTxt = 'This email is already in use';
        }
        else if (text.indexOf('already taken') != -1 && text.indexOf('Username ') != -1) {
            newTxt = 'This username is already used';
        }
        else {
            newTxt = text;
        }
        if(islogin){
            this.errorLoginLabel.enabled = true;
            this.errorLoginLabel.string = newTxt;
        }
        else{
            this.errorLoguplabel.enabled = true;
            this.errorLoguplabel.string = newTxt;            
        }
    }
    validate ( event, custom ) {
        cc.log( 'custom ', custom );
        let str: string;
        if( custom == 'EMAIL' )
            str = this.boxEmail.string;
        else if( custom == 'PASSWORD' )
            str = this.boxPassword.string;
        cc.log( str );
        // let regEx = /^[0-9]+$/;
        // console.log(regEx.test(str));
        // if( !regEx.test( str ) ) {
        //     this.showError( 'WRONG FORMAT ' + custom );
        //     return false;
        // }

        const num = parseInt( str );

        if( custom == 'MONTH' ) {
        }
        else if( custom == 'DAY' ) {
        }
        // cc.log(GameController.inst);
        // const isAllFieldInputted = this.inputList[0] && this.inputList[1] && this.inputList[2];
        return true;
    }

    // showError ( text ) {
    //     this.errorLabel.string = text;
    //     this.errorLabel.enabled = true;
    // }
    // hideError () {
    //     this.errorLabel.string = '';
    //     this.errorLabel.enabled = false;
    // }

    // isValidDate ( s ) {
    //     // Assumes s is "mm/dd/yyyy"
    //     // if( ! /^\d\d\/\d\d\/\d\d\d\d$/.test( s ) ) {
    //     //     return false;
    //     // }
    //     const parts = s.split( '/' ).map( ( p ) => parseInt( p, 10 ) );
    //     parts[0] -= 1;
    //     const d = new Date( parts[2], parts[0], parts[1] );
    //     return d.getMonth() === parts[0] && d.getDate() === parts[1] && d.getFullYear() === parts[2];
    // }

    // testValidDate ( s ) {
    //     console.log( s, this.isValidDate( s ) );
    // }

}

