import { Grammar } from './grammar';
import { Automaton } from './automaton';
import { FormalLanguage } from './formalLanguage';
import LZUTF8 from 'lzutf8';
import { RegularExpression } from './regularExpression';
import { BadLanguage } from './badLanguage';
import { FAEngine } from './FAEngine';
import { PDAEngine } from './PDAEngine';
import { TMEngine } from './TMEngine';


/**
 * LanguageFactory
 * 
 * Loads formal languages from encoded JSON strings
 */
export
class LanguageFactory {
    constructor(user: string) {
        this.user = user;
    }

    user: string;

    clear() {

    }

    load(encodedLanguage: string) {
        let decoded = LZUTF8.decompress(encodedLanguage, { inputEncoding: "Base64" });

        let langObject = JSON.parse(decoded);
        return this._loadLanguageFromJSon(langObject);
    }

    _loadPermitted(jsonObj: any): boolean {
        if (this.user == "Instructor") {
          // Instructors can see anything
          return true;
        }
        if (this.user == jsonObj.createdBy) {
          // Anyone can see their own work
          return true;
        }
        if (jsonObj.createdBy == "Anonymous") {
          // Anyone can see anonymously generated languages
          return true;
        }
        return false;
      }
    
  _loadLanguageFromJSon(jsonObj: any): FormalLanguage {
    if (jsonObj.specification == LanguageFactory.FAspec) {
      let lang = new Automaton(this.user, jsonObj.problemID, new FAEngine());
      lang.fromJSon(jsonObj);
      return lang;
    } else if (jsonObj.specification == LanguageFactory.CFGspec) {
      let lang = new Grammar(this.user, jsonObj.problemID);
      lang.fromJSon(jsonObj);
      return lang;
    } else if (jsonObj.specification == LanguageFactory.REspec) {
      let lang = new RegularExpression(this.user, jsonObj.problemID);
      lang.fromJSon(jsonObj);
      return lang;
    } else if (jsonObj.specification == LanguageFactory.PDAspec) {
      let lang = new Automaton(this.user, jsonObj.problemID, new PDAEngine());
      lang.fromJSon(jsonObj);
      return lang;
    } else if (jsonObj.specification == LanguageFactory.TMspec) {
      let lang = new Automaton(this.user, jsonObj.problemID, new TMEngine());
      lang.fromJSon(jsonObj);
      return lang;
    } else {
      let lang = new BadLanguage(this.user,
        "Unknown language specification: " + jsonObj.specification);
      return lang;
    }
  }

  static CFGspec = 'grammar';
  static REspec = 'regexp';
  static FAspec = 'automatonFA';
  static PDAspec = 'automatonPDA';
  static TMspec = 'automatonTM';
  static BadLanguageSpec = 'badLanguage';

}

