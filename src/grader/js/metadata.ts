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
const problem = args['problem']

console.log('user:' + user);
console.log('problem:' + problem);
console.log('lang:' + lang);

let factory = new LanguageFactory(null, user);
let language = factory.load(lang);

console.log ('specification:' + language.specification);
console.log ('createdBy:' + language.createdBy);
console.log ('problemID:' + language.problemID);
console.log ('unlock:' + language.unlock);

process.exit(0);