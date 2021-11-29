import { fabric } from 'fabric';
import { Grammar } from '../../../../formalLangLib/src/js/grammar';
import { Automaton } from '../../../../formalLangLib/src/js/automaton';
import { FormalLanguage } from '../../../../formalLangLib/src/js/formalLanguage';
import { LanguageFactory } from '../../../../formalLangLib/src/js/languageFactory';
import LZUTF8 from 'lzutf8';
import { RegularExpression } from '../../../../formalLangLib/src/js/regularExpression';
import { BadLanguage } from '../../../../formalLangLib/src/js/badLanguage';
import { AutomatonRendering } from './renderedAutomaton';
import { LanguageRendering } from './renderedLanguage';
import { GrammarRendering } from './renderedGrammar';
import { BadLanguageRendering } from './renderedBadLanguage';
import { RegularExpressionRendering } from './renderedRegularExpression';
import { FAEngine } from '../../../../formalLangLib/src/js/FAEngine';


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
    console.log('RLF.load: ' + decoded);
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
    if (jsonObj.specification == LanguageFactory.FAspec) {
      let lang = new AutomatonRendering(this._canvas, this.user, jsonObj.problemID, new FAEngine());
      lang.fromJSon(jsonObj);
      return lang;
    } else if (jsonObj.specification == LanguageFactory.CFGspec) {
      let lang = new GrammarRendering(this._canvas, this.user, jsonObj.problemID);
      lang.fromJSon(jsonObj);
      return lang;
    } else if (jsonObj.specification == LanguageFactory.REspec) {
      let lang = new RegularExpressionRendering(this._canvas, this.user, jsonObj.problemID);
      lang.fromJSon(jsonObj);
      return lang;
    } else {
      let lang = new BadLanguageRendering(this._canvas, this.user,
        "Unknown language specification: " + jsonObj.specification);
      return lang;
    }
  }

}

