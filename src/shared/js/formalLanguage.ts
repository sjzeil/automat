
/**
 * FormalLanguage
 * 
 * A description of a formal language. Descriptions take the form of
 * 1) an automaton, 
 * 2) a grammar (with a sample derivation), or 
 * 3) a regular expression.
 */
export
class FormalLanguage {
    constructor(user: string) {
        this.specification = "unspecified";
        this.createdBy = user;
        this.unlocked = true;
    }

    specification: string;
    createdBy: string;
    unlocked: boolean;

    clear() {

    }

    toJSon() {
        return '"specification": "' + this.specification + '"\n' +
               '"createdBy": "' + this.createdBy + '"\n' 
    }

    fromJSon(jsonObj: any) {
        this.createdBy = jsonObj.createdBy;
    }


}

