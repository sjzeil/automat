title=Testing a PDA
type=page
manual=student
sequence=B
next=tm
prev=pda
status=published
~~~~~~


Below the main editing area for your PDA, you can see the testing area:


1. Type any alphanumeric string into the "Input text:" box, and click on Start.

    ![](images/testingPDA1.png)

2. Advance the execution one character at a time by using the `Step` button, or run it on the entire input string using `Finish`.


3. In the drawing area, the currently active states will be highlighted. Below each active state, you will see the stacks 
associated with that state.  Because of the nondeterminism of PDAs,
different states may have different stacks, or the same state can be active in multiple ways (different stack contents).

    <img src='images/pdaTest.png' style='float: right;'/>

    For example, this automaton, after 4 input characters have been processed, has state 0 active with a stack `1110Z`. It also has state 1 active with a stack of `10z` and active a second time with stack `1110Z`.
