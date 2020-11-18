import GameController, { SCREEN } from "./GameController";
import LoginController from "./LoginScreen";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameAPI{
    public gameID = "";
    public playerId : number;
    registerSuccess = false;
    loginSuccess = false;
    getLeaderboardSuccess = false;
    updateScoreSuccess = false;
    public lotteryNumber = "";
    public infoMessage = "";
    public static inst : GameAPI = null;
    curToken = null;
    public static getInstance(): GameAPI {
        if (!GameAPI.inst) {
            GameAPI.inst = new GameAPI();
        }
        return GameAPI.inst;
    };    
    constructor() {
        if ( GameAPI.inst) {
            cc.error('There are multiple places constructing GameAPI!!!')
        }
        GameAPI.inst = this;
    }

    // readonly serviceURL = 'http://35.238.238.41:3000/';    
    readonly serviceURL = 'http://69.160.250.66:4000/';
    authTokenList = [
        // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYwNTU4MjA0MiwiZXhwIjoxNjA2MTg2ODQyfQ.8ZuPX8DClj9O1j3Sw-M6gUpAMFAQ7r11tCwZyUEMnnk',
        // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYwNTU4ODE3MSwiZXhwIjoxNjA2MTkyOTcxfQ.i5bkLcj8k090xmDmAkbNRIbam4rxAfiJBEf46_SCco8'
    ]


    public getRandomToken() {
        if(!this.curToken){
            const rand = this.RandomRange(0, this.authTokenList.length-1, true);
            this.curToken = this.authTokenList[rand];
        }
        return this.curToken;

    }
    public RandomRange( min:number,  max:number, int:boolean = false  ) {
        // TODO: Change this to use whatever the synchronized random solution

        var delta = max  - min;
        var rnd = Math.random();
        var result = min + rnd*delta;

        if( int ) {
            result = Math.round( result );

        }
        return result;

    }

    register(params){
        const route = 'users/register';
        const token = this.getRandomToken();
        const pars = {
            "email": params.email,
            "password" : params.password,
            "confirmPassword" : params.confirmPassword,
            "username" : params.username,
            "birthday" : params.birthday,
        };
        const authToken = null;
        let t = this;
        const callback = () => {
            console.log('get register status :',this.registerSuccess)
            // console.log('get OTP Info :',this.infoMessage);
            if (this.registerSuccess){
                // GameController.inst.showInfo('otp sent');
                cc.log('registerSuccess ',this.infoMessage);
            }
            else{
                cc.log('getOTP Error ',this.infoMessage);
                // GameController.inst.showInfo(this.infoMessage);
            }
            LoginController.getInstance().gotoScreen(true);
        }        
        new Promise((resolve, reject) => {
            t.servicePost('POST', route, pars, authToken, (err, result) => {

                if (err) {
                    cc.log(err);
                    this.infoMessage = err;
                    reject(err);
                }
                cc.log(result);
                let jsonData = JSON.parse( result );
                if(jsonData) {
                    this.registerSuccess = jsonData.success;
                    this.infoMessage = jsonData.message;
                }
                resolve(result);
            });

        }).then(() => {
            callback();
        }).catch(()=>{
           LoginController.getInstance().showAPIError(this.infoMessage) // cc.log('Error when get OTP');
        });
    }


    login(params){
        const route = 'users/authenticate';
        const token = this.getRandomToken();
        const pars = {
            "email": params.email,
            "password" : params.password,
        };
        const authToken = null;
        let t = this;
        const callback = () => {
            console.log('get login status :',this.loginSuccess)
            // console.log('get OTP Info :',this.infoMessage);
            if (this.loginSuccess){
                // GameController.inst.showInfo('otp sent');
                cc.log('loginSuccess ',this.infoMessage);
            }
            else{
                cc.log('login Error ',this.infoMessage);
                // GameController.inst.showInfo(this.infoMessage);
            }
            GameController.inst.gotoScreen( SCREEN.HOME_SCREEN );
            
        }        
        new Promise((resolve, reject) => {
            t.servicePost('POST', route, pars, authToken, (err, result) => {

                if (err) {
                    cc.log(err);
                    this.infoMessage = err;
                    reject(err);
                }
                cc.log(result);
                let jsonData = JSON.parse( result );
                if(jsonData) {
                    this.loginSuccess = jsonData.success;
                    this.playerId = jsonData.id;
                    // GameController.inst.updateHighScore(5);
                    GameController.inst.updateHighScore(jsonData.highScore || 0);

                    this.infoMessage = jsonData.message;
                    this.authTokenList.push(jsonData.token);
                    cc.log('authTokenList ',this.authTokenList);
                }
                resolve(result);
            });

        }).then(() => {
            callback();
        }).catch(()=>{
        //    LoginController.getInstance().showAPIError(this.infoMessage) // cc.log('Error when get OTP');
        });
    }

    getLeaderBoards(){
        const route = 'users';
        const token = this.getRandomToken();
        const pars = {
        };
        const callback = () => {
            if (this.getLeaderboardSuccess){
                // GameController.inst.userTicket = this.lotteryNumber;
                // GameController.inst.gotoGenerateTicketScreen();
            }
            else {
                // GameController.inst.userTicket = '123456';
                // GameController.inst.gotoGenerateTicketScreen();
                cc.log('GetTicket Error: ',this.infoMessage);
            }
            GameController.inst.gotoScreen( SCREEN.LEADER_BOARD );
        }
        const authToken = this.authTokenList[0];
        let t = this;
        new Promise((resolve, reject) => {
            cc.log('servicePost');
            t.servicePost('GET', route, pars, authToken, (err, result) => {

                if (err) {
                    cc.log(err);
                    reject(err);
                }
                cc.log(result);
                let jsonData = JSON.parse( result );                
                cc.log(jsonData);
                if(jsonData) {
                    GameController.inst.leaderBoardContent = jsonData;
                    let success = jsonData.success;
                    this.infoMessage = jsonData.info;
                    if(success){
                        // this.lotteryNumber = jsonData.lotteryNumber;
                        // cc.log('lotteryNumber: ',this.lotteryNumber);
                        this.getLeaderboardSuccess = true;
                    }
                }                
                resolve(result);
            });

        }).then(() => {
            cc.log('THEN ');
            callback();
        }).catch(()=>{
            cc.log('ERROR ');
        });
    }

    updateYourScore(){
        const route = 'users/' + this.playerId;
        const token = this.getRandomToken();
        const score = GameController.inst.playerScore;
        const highScore = GameController.inst.highScore;
        const pars = {
            'score' : score,
            'highScore' : highScore
        };
        const callback = () => {
            if (this.updateScoreSuccess){
                // GameController.inst.userTicket = this.lotteryNumber;
                // GameController.inst.gotoGenerateTicketScreen();
            }
            else {
                // GameController.inst.userTicket = '123456';
                // GameController.inst.gotoGenerateTicketScreen();
                cc.log('GetTicket Error: ',this.infoMessage);
            }
        }
        const authToken = this.authTokenList[0];
        let t = this;
        new Promise((resolve, reject) => {
            cc.log('servicePost');
            t.servicePost('PUT', route, pars, authToken, (err, result) => {

                if (err) {
                    cc.log(err);
                    reject(err);
                }
                cc.log(result);
                let jsonData = JSON.parse( result );                
                cc.log(jsonData);
                if(jsonData) {
                    let success = jsonData.success;
                    this.infoMessage = jsonData.info;
                    if(success){
                        // this.lotteryNumber = jsonData.lotteryNumber;
                        // cc.log('lotteryNumber: ',this.lotteryNumber);
                        this.updateScoreSuccess = true;
                    }
                }                
                resolve(result);
            });

        }).then(() => {
            cc.log('THEN ');
            callback();
        }).catch(()=>{
            cc.log('ERROR ');
        });
    }


    servicePost(method: string = 'POST', route:string, params, accessToken, callback)  {
        var url = this.serviceURL + route;
        let finalParams = JSON.stringify(params)

        const promise = this.postHttp(method, url, finalParams, 'application/json', accessToken);

        promise.then((response) => {
            callback(null,response);
        });

        promise.catch((error) => {
            callback( error, null);
        });
        
    }

    postHttp(method: string = 'POST', url, pars, contentType = 'application/json', accessToken = null): Promise<any> {

        return new Promise((resolve, reject) => {

            var http = new XMLHttpRequest();
            console.log('pars:',pars);
            
            http.open(method, url, true);
            http.setRequestHeader('Content-type', contentType);
            if(accessToken) {
                cc.log('set AccessToken ',accessToken);
                http.setRequestHeader('Authorization', 'Bearer '+accessToken);
            }
            http.onloadend = () => {
                if (http.readyState == 4 && http.status == 200) {
                    cc.log('response 200 : ',http.response);
                    resolve( http.response);
                } else if(http.readyState == 4){
                    cc.log('response  : ',http.response);
                    reject(http.response);
                }
            };

            http.onerror = (err)=> {
                reject("Error post URL " + url + ": " + err);
            }

            http.ontimeout = (err) => {
                reject("Timeout post URL " + url);
            }
            
            http.send(pars);

        });
    };
}
