title=Context-Free Grammars
type=page
manual=student
sequence=8
next=derivations
prev=creatingAnRE
status=published
~~~~~~
## Creating a new Grammar

<img src='images/newLanguagesMenu.png' style='float: right;'/>

To create a new Grammar, look for the list of possible formal language types and click on `Context-Free Grammar`.

You will see a split screen with a drawing area on the left and an editing area to the right.

## Creating Productions

![](images/productionEditor.png)

You can now build your new grammar by adding productions in the editor area.

By default, a new grammar starts with a single production: $S \rightarrow$

* Each production must have a single nonterminal symbol to the left of the $\rightarrow$.
    * Nonterminals are represented by upper-case alphabetic characters A..Z.
* On the right of the $\rightarrow$, a production can have a (possibly empty) list of terminal symbols.
    * Terminal symbols can be any printable (non-whitespace) ASCII character other than A..Z.  
    * Although '|' is often treated as a special syntax character in CFGs, it is **not** recognized as such in Automat. It is simply treated as another terminal symbol.   The two productions commonly written as $A \rightarrow a|b$ must be entered in Automat as two productions:
    
        $A \rightarrow a$

        $A \rightarrow b$




## Managing the Productions

![](images/productionEditor2.png)

The productions for the grammar are shown as a list in the production area.

* Use the `Add` button to add the production in the text boxes to the list.
* Use the `Replace` button to replace the currently selected production in the list by the contents of the text boxes.
* Use the `Remove` button to remove the currently selected production from the list.
* Use the `Up` and `Down` buttons to change the position of the currently selected production within the list.
    * The order of productions in a grammar is not normally significant.  In Automat, there is one case in which the order is significant.

> _The starting symbol of the grammar is the symbol of the left of the first production._

## Testing the Grammar

You can check to see whether strings are accepted by the grammar by typing the string into the `Testing` area and clicking the `test` button.

