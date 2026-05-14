---
title: "On Writing Readable Code"
date: 2026-04-20
excerpt: "Readable code isn't about comments or naming conventions. It's about managing what the reader has to hold in their head at once."
tags: ["technical", "craft"]
draft: false
---

Most advice about readable code focuses on surface things: name your variables well, keep functions short, add comments. That's all true, but it misses the deeper point.

Readable code is code that minimises what the reader has to hold in their head at once.

## Cognitive load, not aesthetics

When you read a function and have to track five mutable variables, remember which conditions have already been checked, and reconstruct the call stack to understand what `result` even means — that's high cognitive load. The code might be perfectly named. It's still hard to read.

The question to ask isn't "does this look clean?" but "how much does the reader have to know before this makes sense?"

## A few things that actually help

**Locality.** Put things near where they're used. A variable declared at the top of a 60-line function forces the reader to remember it the whole way down. Declare it just before it's needed.

**Linearity.** Code that flows top-to-bottom without jumping between states is easier to follow than code that mutates shared objects across callbacks and conditionals. Immutability and explicit data flow help with this.

**Explicit over implicit.** When a function does something surprising, say so — not in a comment, but in the structure. A function that returns early when the input is invalid is clearer than one that silently does nothing.

## The test

Ask yourself: could a competent engineer who hasn't seen this code understand what it does in two minutes, without context? If not, the issue is usually complexity, not style.

That's the bar. Not beautiful — comprehensible.
