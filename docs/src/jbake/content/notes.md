title=Implementation Notes
type=page
manual=instructor
sequence=4
prev=newProblems
status=published
~~~~~~

# Timeouts

Both the Turing machine and the CFG parser have timeout protection in which the number of steps performed in processing has a fixed upper bound.

Turing machines are currently limited to 10,000 steps per execution attempt. After that, it is assumed that the TM is not going to terminate.

The CFG parser is limited to exploring 10000 derivation steps. After that, it gives up and declares that the string cannot be parsed.  


# Parsing Grammars

The slowest language processor to use in grade reports is the CFG parser. It currently works as follows:


* Convert the grammar G to a new grammar G2 by removing direct and indirect left-recursion.
* Beginning with the grammar's start symbol, do a breadth-first exploration of the possible leftmost derivations. 
    * As each new partial derivation is obtained, check it against the target string of terminals. 
    
        Discard this derivation without further exploration if the sequence of terminals within it
        is inconsistent with the arrangement of terminals in the target string. 
        
        (e.g., if the target string is `xyzzy` and we have derived `xABy` and `xyAxB`, we would retain `xABy`
         for further  exploration but would prune `xyAxB`.)


A more sophisticated algorithm may be used in the future.


