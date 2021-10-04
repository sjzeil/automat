import { fabric } from 'fabric';

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
    constructor(canvas: fabric.Canvas, user: string) {
        this._canvas = canvas;
        this.specification = "unspecified";
        this.createdBy = user;
        this.unlocked = true;
    }

    _canvas: fabric.Canvas;
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

    static load(encodedLanguage: string, user: string) {
        let decoded = LZUTF8.decompress(encodedLanguage, { inputEncoding: "Base64" });
        let langObject = JSON.parse(decoded);
        return this.loadLanguageFromJSon(langObject, user);
    }

    static _loadPermitted(jsonObj: any, user: string): boolean {
        if (user == "Instructor") {
          // Instructors can see anything
          return true;
        }
        if (user == jsonObj.createdBy) {
          // Anyone can see their own work
          return true;
        }
        if (jsonObj.createdBy == "Anonymous") {
          // Anyone can see anonymously generated languages
          return true;
        }
        return false;
      }
    
      static loadLanguageFromJSon(jsonObj: any, user: string, canvas: null | fabric.Canvas): FormalLanguage {
        if (this._loadPermitted(jsonObj, user)) {
          if (jsonObj.specification == "automaton") {
            let lang = new Automaton(canvas, user);
            lang.fromJSon(jsonObj);
            return lang;
          } else if (jsonObj.specification == "grammar") {
            let lang = new Grammar(canvas, user);
            lang.fromJSon(jsonObj);
            return lang;
          } else if (jsonObj.specification == "regexp") {
            let lang = new RegularExpression(this.props.canvas, this.props.user);
            lang.fromJSon(jsonObj);
            return lang;
          } else {
            let lang = new BadLanguage(this.props.canvas, this.props.user,
              "Unknown language specification: " + jsonObj.specification);
            this.state = {
              status: "badLang",
              oldStatus: "new",
              editing: null,
              clicked: null,
            }
            return lang;
          }
        } else {
          let lang = new BadLanguage(this.props.canvas, this.props.user,
            this.props.user + " cannot view languages created by " + jsonObj.createdBy);
          this.state = {
            status: "badLang",
            oldStatus: "new",
            editing: null,
            clicked: null,
          }
          return lang
        }
      }   

}

