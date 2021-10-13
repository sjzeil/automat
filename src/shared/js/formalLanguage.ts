import LZUTF8 from 'lzutf8';

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

    saveJSon(jsonObj: any) {
        jsonObj.specification = this.specification;
        jsonObj.createdBy = this.createdBy;
        jsonObj.problemID = this.problemID;
        jsonObj.unlock = this.unlock;
    }

    fromJSon(jsonObj: any) {
        this.createdBy = jsonObj.createdBy;
        this.problemID = jsonObj.problemID;
        this.unlock = jsonObj.problemID;
    }

    encodeLanguage() {
          let jsonObj = {};
          this.saveJSon(jsonObj);
          let json = JSON.stringify(jsonObj);
          let encoded = LZUTF8.compress(json, { outputEncoding: "Base64" });
          console.log("json length: " + json.length + "  encoded length: " + encoded.length);
          return encoded;
      }
    
    

}

