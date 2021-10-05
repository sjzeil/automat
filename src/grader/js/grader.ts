/**
 * grader standalone executable
 * 
 * Usage: node grader.ts --problem=path-to-problem.ini --lang=encoded-formal-language
 */

 import { Canvas } from 'canvas';
import { fabric } from 'fabric';

 import {FormalLanguage} from '../../shared/js/formalLanguage';
 import {LanguageFactory} from '../../shared/js/languageFactory';
 import "../../editor/css/editor.css";
 


const args = require('minimist')(process.argv.slice(2))

const user = args['user']
const lang = args['lang']

console.log ("<pre>");
console.log('user is ' + user);
console.log('lang is ' + lang);

let factory = new LanguageFactory(null, user);
let language = factory.load(lang);

console.log ('specification: ' + language.specification);


console.log ("</pre>");
