import { FAEngine } from '../js/FAEngine';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Automaton } from '../js/automaton';
import { PDAEngine } from '../js/PDAEngine';
import { LanguageFactory } from '../js/languageFactory';



describe('FAEncode', function () {
    context('check-encoding', function () {
        let lang='eyJzcGVjaWZpY2F0aW9uIjoiYXV0b21hdG9uRkEiLCJjcmVhdGVkQnkiOiJJbnN0cnVjdG9yIiwicHJvYmxlbUlEIjoidGVzdFDGECIsInVubG9jayI6IiIsInN0YXRlcyI6W3sibGFiZWwiOiIwIiwiaW5pdGlhbCI6dHJ1ZSwiZmluxA1mYWxzZSwieCI6MTgxLCJ5IjoyMDR9LMo7Mcw7xy7RPDMzxjwxNjXMPDLaPOYAhXgiOjQ5NcZ3ODF9XSwidHJhbnNp5AEX5gDCZnJvbecAwXRv5wCPyF8wIsRtxyLEGcUixHXIIjEifV19';
        let factory = new LanguageFactory('Instructor');
        let language = factory.load(lang);
        let jsonObj = {} as any;
        language.saveJSon(jsonObj);
        it('should be FA', function () {
            expect(jsonObj.states.length).to.equal(3);
            expect(jsonObj.states[0].x).to.not.equal(100);
        });
    });

});