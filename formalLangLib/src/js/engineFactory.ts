import { AutomatonEngine } from "./automatonEngine";
import { FAEngine } from "./FAEngine";
import { LanguageFactory } from "./languageFactory";
import { PDAEngine } from "./PDAEngine";

export class EngineFactory {

    static newEngine(specification: string): AutomatonEngine {
        if (specification == LanguageFactory.FAspec) {
            return new FAEngine();
        } else if (specification == LanguageFactory.PDAspec) {
            return new PDAEngine();
        } else {
            return new FAEngine();
        }
    }
}