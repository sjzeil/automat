import { AutomatonEngine } from "./automatonEngine";
import { FAEngine } from "./FAEngine";
import { LanguageFactory } from "./languageFactory";
import { PDAEngine } from "./PDAEngine";
import { TMEngine } from "./TMEngine";

export class EngineFactory {

    static newEngine(specification: string): AutomatonEngine {
        if (specification == LanguageFactory.FAspec) {
            return new FAEngine();
        } else if (specification == LanguageFactory.PDAspec) {
            return new PDAEngine();
        } else if (specification == LanguageFactory.TMspec) {
            return new TMEngine();
        } else {
            return new FAEngine();
        }
    }
}