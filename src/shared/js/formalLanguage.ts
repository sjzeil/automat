
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
        this.unlock = "";
        this.problemID = "";
    }

    specification: string;
    createdBy: string;
    problemID: string;
    unlock: string;

    clear() {

    }

    toJSon() {
        return '"specification": "' + this.specification + '"\n' +
               '"createdBy": "' + this.createdBy + '"\n' +
               '"problemID": "' + this.problemID + '"\n' +
               '"unlock": "' + this.unlock + '"\n'
    }

    fromJSon(jsonObj: any) {
        this.createdBy = jsonObj.createdBy;
        this.problemID = jsonObj.problemID;
        this.unlock = jsonObj.problemID;
    }


}

