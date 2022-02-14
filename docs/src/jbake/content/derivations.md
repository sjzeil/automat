title=Derivations and Parse Trees 
type=page
manual=student
sequence=9
next=pda
prev=cfg
status=published
~~~~~~

<img src='images/parsetree.png' style='float: right;'/>

Once you have created a grammar, you can use it to construct derivations of strings in the language.  As you build your derivation, Automat displays the corresponding parse tree.

## Deriving a String


To construct a derivation, you work with the list of productions in the main editing area, the parse tree shown in the graphics area, and the `step` buttons in the `Derivation` area.

<img src='images/derivation.png'/>

1. Examine the current string shown in the graphics area and the Derivation area.  Decide which nonterminal you want to expand.
2. Click on the corresponding nonterminal in the parse tree to select it.
3. In the list of productions, selct a production having that nonterminal symbol on the left.
4. In the `Derivation` area, click the `+step` button.

The derivation and the parse tree will be updated by expanding the nonterminal using the selected production.

