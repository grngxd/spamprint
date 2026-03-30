# 🫆spamprint
> fingerprinting people based on how they spam different keys on their keyboard

spamprint is a lightweight text classification experiment that identifies who produced a keyboard mash based on their typing patterns.
It builds a probabilistic model of each user's character transitions and compares new input against those models.

or in english:
someone mashes their keyboard -> this tells you who did it

## example
```
enter a string to predict its name (or 'exit' to quit): askmldashkjdhasjklhdijkashidlasj
prediction: grng (confidence: 100.00%)
```

```
enter a string to predict its name (or 'exit' to quit): OIPOIPIpo_+[pppP{]][[][]]
prediction: kushai (confidence: 91.74%)
```

## cool, but how does it work?
1. training
    - each user provides multiple samples of how they mash the keyboard, see [the training data](./training.json) for an example
    - then we build a transition map (how many times letter X goes to letter Y)
    - then we convert that into probabilities
2. scoring
    - given a new string eg: `asdfghjkl`
    - we 
        - look up each transition
        - sum log probabilities
3. prediction
    - the user with the highest score is the most likely to have produced the input
    - confidence = gap between top 2 candidates

## okay, but WHY does it work?
- people have unique typing patterns, even when mashing
- even when trying to be random, people have subconscious biases in how they hit keys
- such as starting from the same keys, moving in similar directions, or favoring certain fingers
- these biases create identifiable patterns in the transition probabilities
- by modeling/identifying these patterns, we can identify the most likely source of a given input

## sure, but why????
- cmon, have you never wanted to see if you can identify your friends just from their keyboard mashes?
- no? ok fair enough
- but really, it's a fun experiment in probabilistic modeling and pattern recognition
- and it shows how even seemingly random behavior can have underlying structure that can be analyzed and predicted


## tldr
- spamprint is a fun experiment that identifies who produced a keyboard mash based on their unique typing patterns
- it builds a probabilistic model (i.e fingerprint) of character transitions for each user and compares new input against those
- and its weirdly good at doing it

## silly use cases
- 2fa: instead of sending a code, ask the user to mash their keyboard and verify it against their profile
- online games: identify players based on their typing patterns to prevent smurfing or account sharing

## how do i run it?
- download [bun](https://bun.sh) and run `bun .` in the project directory
- it will prompt you to enter training data, but you can just hit enter to use the default training data in `training.json`