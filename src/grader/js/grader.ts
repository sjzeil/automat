/**
 * grader standalone executable
 * 
 * Usage: node grader.ts --problem=path-to-problem.ini --lang=encoded-formal-language
 */


import {FormalLanguage} from '../../shared/js/formalLanguage';
import {LanguageFactory} from '../../shared/js/languageFactory';
 


const args = require('minimist')(process.argv.slice(2))

const user = args['user']
const lang = args['lang']

console.log ("<pre>");
console.log('user is ' + user);
console.log('lang is ' + lang);

let factory = new LanguageFactory(null, user);
let language = factory.load(decodeURIComponent(lang));

console.log ('specification: ' + language.specification);
console.dir (language, {depth: 2});

console.log ("</pre>");
process.exit(0);