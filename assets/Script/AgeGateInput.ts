const { ccclass, property } = cc._decorator;
export enum DATE {
    DAY,
    MONTH,
    YEAR
}
@ccclass
export default class BackgroundAdapter extends cc.Component {

    @property( cc.EditBox )
    boxMonth: cc.EditBox = null;

    @property( cc.EditBox )
    boxDate: cc.EditBox = null;

    @property( cc.EditBox )
    boxYear: cc.EditBox = null;

    @property( cc.Label )
    errorLabel: cc.Label = null;
    inputList: boolean[];

    onLoad () {
        this.inputList = [false, false, false];
    }

    validate ( event, custom ) {
        cc.log( 'custom ', custom );
        let str: string;
        if( custom == 'MONTH' )
            str = this.boxMonth.string;
        else if( custom == 'DAY' )
            str = this.boxDate.string;
        else if( custom == 'YEAR' )
            str = this.boxYear.string;
        cc.log( str );
        let regEx = /^[0-9]+$/;
        // console.log(regEx.test(str));
        if( !regEx.test( str ) ) {
            this.showError( 'WRONG FORMAT ' + custom );
            return false;
        }

        const num = parseInt( str );

        if( custom == 'MONTH' ) {
            if( num < 1 || num > 12 ) {
                this.showError( 'WRONG FORMAT ' + custom );
                return false;
            }
            else {
                this.inputList[DATE.MONTH] = true;
            }
        }
        else if( custom == 'DAY' ) {
            if( num < 1 || num > 31 ) {
                this.showError( 'WRONG FORMAT ' + custom );
                return false;
            }
            else {
                this.inputList[DATE.DAY] = true;
            }
        }
        else if( custom == 'YEAR' ) {
            if( num < 1 || num > 2020 ) {
                this.showError( 'WRONG FORMAT ' + custom );
                return false;
            }
            else {
                this.inputList[DATE.YEAR] = true;
            }
        }

        const isAllFieldInputted = this.inputList[0] && this.inputList[1] && this.inputList[2];
        if( isAllFieldInputted ) {
            const date = this.boxMonth.string + '/' + this.boxDate.string + '/' + this.boxYear.string;
            cc.log( 'date ', date );
            const valid = this.isValidDate( date )
            if( !valid ){
                this.showError('PLEASE INPUT AN INVALID DATE');
            }
        }
        
        return true;
    }

    showError ( text ) {
        this.errorLabel.string = text;
        this.errorLabel.enabled = true;
    }
    hideError () {
        this.errorLabel.string = '';
        this.errorLabel.enabled = false;
    }

    isValidDate ( s ) {
        // Assumes s is "mm/dd/yyyy"
        // if( ! /^\d\d\/\d\d\/\d\d\d\d$/.test( s ) ) {
        //     return false;
        // }
        const parts = s.split( '/' ).map( ( p ) => parseInt( p, 10 ) );
        parts[0] -= 1;
        const d = new Date( parts[2], parts[0], parts[1] );
        return d.getMonth() === parts[0] && d.getDate() === parts[1] && d.getFullYear() === parts[2];
    }

    testValidDate ( s ) {
        console.log( s, this.isValidDate( s ) );
    }

}