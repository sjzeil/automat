import React from 'react';
import ReactDOM from 'react-dom';
import { FormalLanguage } from '../../../formalLangLib/src/js/formalLanguage';
import { FormalLanguageEditor, MouseLoc } from './formalLanguageEditor';
import { GrammarEditor } from './grammarEditor';
import { Grammar, Production } from '../../../formalLangLib/src/js/grammar';
import { fabric } from 'fabric';



interface ProductionEditorProps {
    parent: GrammarEditor;
    selectedOption: number;
}

interface ProductionEditorState {
    selected: Production | null;
    workingLabel: string;
    production: Production | null;
    partialProduction: Production;
}

interface optionListItem {
    id: number;
    value: string;
}



export class ProductionEditor extends React.Component<ProductionEditorProps, ProductionEditorState> {
    constructor(props: ProductionEditorProps) {
        super(props);
        console.log("ProductionEditor constructed");
        let workingText = "";
        let initialProd = null;
        for (let prod of props.parent.rendering.language.productions) {
            if (workingText != "") {
                workingText += "\n";
            } else {
                initialProd = prod;
            }
            workingText += prod.lhs + Grammar.ProducesChar + prod.rhs;
        }
        if (workingText == "") {
            workingText = 'S' + Grammar.ProducesChar;
            initialProd = {lhs: "S", rhs: ""};
        }
        this.state = (
            {
                selected: null,
                workingLabel: workingText,
                production: null,
                partialProduction:  initialProd as Production,
            }
        );

        this.handleChange = this.handleChange.bind(this);
        this.lhsChanged = this.lhsChanged.bind(this);
        this.rhsChanged = this.rhsChanged.bind(this);
        this.addProductionOption = this.addProductionOption.bind(this);
        this.replaceProductionOption = this.replaceProductionOption.bind(this);
        this.selectedProductionOption = this.selectedProductionOption.bind(this);
        this.upProductionOption = this.upProductionOption.bind(this);
        this.downProductionOption = this.downProductionOption.bind(this);
        this.removeProductionOption = this.removeProductionOption.bind(this);
        //this.fill = this.fill.bind(this);
    }


    componentDidMount() {
        console.log("ProductionEditor mounted");
    }

    componentDidUpdate() {
        console.log("ProductionEditor updated");
        let selectedElement = this.props.parent.props.parent.state.editing;
        console.dir(selectedElement);
    }

    componentWillUnmount() {
        console.log("ProductionEditor unmounted");
    }

    handleChange(event: any) {
        console.log("in event handler");
    }

    lhsChanged(newLHS: string) {
        let newProd = {lhs: newLHS, rhs: this.state.partialProduction.rhs}
        this.setState ({
            partialProduction: newProd,
        });
    }
    rhsChanged(newRHS: string) {
        let newProd = {lhs: this.state.partialProduction.lhs, rhs: newRHS}
        this.setState ({
            partialProduction: newProd,
        });
    }


    render() {
        console.log("ProductionEditor rendering");
        
        let productionsText = this.state.workingLabel.split("\n");
        let keyedProductions: optionListItem[] = [];
        productionsText.forEach((productionLabel) => keyedProductions.push({id: keyedProductions.length, value: productionLabel}));
        let optionSet = (<React.Fragment>
            {
                keyedProductions.map((item) => (
                    <option key={"production" + item.id} value={"production" + item.id} 
                        >{item.value}</option>
                ))
            }
        </React.Fragment>);
        return (
            <div id="productionEditor" className="editors">
                <h2>Productions</h2>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <span>Production:</span>
                                <input type="text" id="production_lhs" name="production_lhs" 
                                    onChange={(ev: React.ChangeEvent<HTMLInputElement>): void => this.lhsChanged(ev.target.value)}
                                    value={this.state.partialProduction.lhs}
                                    className="lhs"
                                    maxLength={1}
                                    />
                                <span>{Grammar.ProducesChar}</span>
                                <input type="text" id="production_rhs" name="production_rhs" 
                                    onChange={(ev: React.ChangeEvent<HTMLInputElement>): void => this.rhsChanged(ev.target.value)}
                                    value={this.state.partialProduction.rhs}
                                    />
                            </td>
                            <td>
                                <select id="production_selection" size={8} 
                                    onChange={this.selectedProductionOption}
                                    //onChange={(ev: React.ChangeEvent<HTMLInputElement>): void => this.selectedProductionOption(ev.target.value)}
                                    value={"production" + this.props.parent.state.selectedProduction}>
                                    {optionSet}
                                </select>
                            </td>
                            <td>
                                <input type="button" value="Add" id="add_production_label" 
                                    onClick={this.addProductionOption} /><br />
                                <input type="button" value="Replace" id="edit_production_label" 
                                    onClick={this.replaceProductionOption} /><br />
                                <input type="button" value="Remove" id="remove_production_label" 
                                    onClick={this.removeProductionOption} /><br />
                                <input type="button" value="Up" id="up_production_label" 
                                    onClick={this.upProductionOption} /><br />
                                <input type="button" value="Down" id="down_production_label" 
                                    onClick={this.downProductionOption} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="wrapped">
                    Starting symbol is: <code>{this.props.parent.rendering.language.productions[0].lhs}</code>
                </div>
                <div className="explanation">
                    The left-hand side of each production must be a single non-terminal (A-Z).
                </div>
                <div className="explanation">
                    The right-hand side of each production can be a string of mixed non-terminals and terminals (printable characters other than A-Z).
                </div>
            </div>
        );
    }

    parseProd(prodStr: string) {
        let divider = Grammar.ProducesChar;
        let k = prodStr.indexOf(divider);
        let production = {
            lhs: prodStr.substr(0, k),
            rhs: prodStr.substr(k + divider.length)
        }
        return production;
    }

    packProd(prod: Production) {
        let divider = Grammar.ProducesChar;
        return prod.lhs + divider + prod.rhs;
    }



    selectedProductionOption(event: any) {
        let target = event.target;
        let selectedNum: number;
        let productionsText = this.state.workingLabel.split("\n");
        for (selectedNum = 0; selectedNum < target.length; ++selectedNum)
        {
            if (target[selectedNum].selected) {
                this.setState ({
                    //selectedOption: selectedNum,
                    partialProduction: this.parseProd(productionsText[selectedNum]),
                });
                this.props.parent.setState ({
                    selectedProduction: selectedNum,
                });
                break;
            }
        }
    }

    addProductionOption() {
        let productionsText = this.state.workingLabel.split("\n");
        let newLabel = this.state.workingLabel + "\n" + this.packProd(this.state.partialProduction);
        this.setState({
            workingLabel: newLabel,
        });
        this.props.parent.setState({
            selectedProduction: productionsText.length,
        });
        this.fillProductions(newLabel);
    }

    replaceProductionOption() {
        let productionsText = this.state.workingLabel.split("\n");
        if (this.props.selectedOption >= 0 && this.props.selectedOption <= productionsText.length) {
            productionsText[this.props.selectedOption] = this.packProd(this.state.partialProduction);
            let newLabel = productionsText.join("\n");
            this.fillProductions(newLabel);
            this.setState ({
                workingLabel: productionsText.join("\n"),
            })
        }
    }

    removeProductionOption() {
        let productionsText = this.state.workingLabel.split("\n");
        if (productionsText.length > 1 && this.props.selectedOption >= 0 && this.props.selectedOption < productionsText.length) {
            productionsText.splice(this.props.selectedOption, 1);
            let newText = productionsText.join("\n");
            this.setState({
                workingLabel: newText,
            });
            this.props.parent.setState ({
                selectedProduction: 0,
            });
            this.fillProductions(newText);
        }
    }

    downProductionOption() {
        let productionsText = this.state.workingLabel.split("\n");
        if (productionsText.length > 1 && this.props.selectedOption < productionsText.length - 1) {
            let temp = productionsText[this.props.selectedOption];
            productionsText[this.props.selectedOption] = productionsText[this.props.selectedOption+1];
            productionsText[this.props.selectedOption+1] = temp;
            let newText = productionsText.join("\n");
            this.setState({
                workingLabel: newText,
            });
            this.props.parent.setState({
                selectedProduction: this.props.selectedOption + 1,
            });
            this.fillProductions(newText);
        }
    }

    upProductionOption() {
        let productionsText = this.state.workingLabel.split("\n");
        if (productionsText.length > 1 && this.props.selectedOption > 0) {
            let temp = productionsText[this.props.selectedOption];
            productionsText[this.props.selectedOption] = productionsText[this.props.selectedOption-1];
            productionsText[this.props.selectedOption-1] = temp;
            let newText = productionsText.join("\n");
            this.setState({
                workingLabel: newText,
            });
            this.props.parent.setState({
                selectedProduction: this.props.selectedOption - 1,
            });
            this.fillProductions(newText);
        }

    }

    
    fillProductions(workingText: string) {
        let language = this.props.parent.rendering.language;
        language.productions = [];
        let productionsText = workingText.split("\n");
        let i;
        for (i = 0; i < productionsText.length; ++i)
        {
            language.productions.push(this.parseProd(productionsText[i]));
        }
        this.props.parent.rendering.resetDerivations();
        this.props.parent.rendering.treeLayout();
    }


}

