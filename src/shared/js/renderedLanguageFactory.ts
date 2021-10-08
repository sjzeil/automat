import { fabric } from 'fabric';
import { Grammar } from '../../shared/js/grammar';
import { Automaton } from '../../shared/js/automaton';
import { FormalLanguage } from '../../shared/js/formalLanguage';
import LZUTF8 from 'lzutf8';
import { RegularExpression } from '../../shared/js/regularExpression';
import { BadLanguage } from '../../shared/js/badLanguage';
import { AutomatonRendering } from './renderedAutomaton';
import { LanguageRendering } from './renderedLanguage';
import { GrammarRendering } from './renderedGrammar';
import { BadLanguageRendering } from './renderedBadLanguage';
import { RegularExpressionRendering } from './renderedRegularExpression';


/**
 * RenderedLanguageFactory
 * 
 * Loads formal languages with rendering info from encoded JSON strings
 */
export
class RenderedLanguageFactory {
    constructor(canvas: fabric.Canvas, user: string) {
        this._canvas = canvas;
        this.user = user;
    }

    _canvas: fabric.Canvas;
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
    
      _loadLanguageFromJSon(jsonObj: any): LanguageRendering {
        if (this._loadPermitted(jsonObj)) {
          if (jsonObj.specification == "automaton") {
            let lang = new AutomatonRendering(this._canvas, this.user);
            lang.fromJSon(jsonObj);
            return lang;
          } else if (jsonObj.specification == "grammar") {
            let lang = new GrammarRendering(this._canvas, this.user);
            lang.fromJSon(jsonObj);
            return lang;
          } else if (jsonObj.specification == "regexp") {
            let lang = new RegularExpressionRendering(this._canvas, this.user);
            lang.fromJSon(jsonObj);
            return lang;
          } else {
            let lang = new BadLanguageRendering(this._canvas, this.user,
              "Unknown language specification: " + jsonObj.specification);
            return lang;
          }
        } else {
          let lang = new BadLanguageRendering(this._canvas, this.user,
          this.user + " cannot view languages created by " + jsonObj.createdBy);
          return lang
        }
      }   

}

