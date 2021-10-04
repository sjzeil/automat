/**
 * grader standalone executable
 * 
 * Usage: node grader.ts --problem=path-to-problem.ini --lang=encoded-formal-language
 */

const args = require('minimist')(process.argv.slice(2))

console.log ("<pre>");
process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`)
  })
  console.log('lang is ' + args['lang']);


function sum (num1:number, num2:number){
    return num1 + num2;
}
console.log(sum(8,4))
console.log ("</pre>");
