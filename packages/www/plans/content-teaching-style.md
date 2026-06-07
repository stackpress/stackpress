# Stackpress Content Teaching Style

This guide describes how Stackpress course content should teach junior
developers. It works together with `content-shape.md`.

`content-shape.md` decides the structure of each file. This guide decides the
teaching voice, pacing, examples, transitions, and walkthrough style inside
that structure.

The goal is a guided book, not a manual. The reader should understand why a
topic matters before they are asked to memorize terms or copy code.

## Reader Model

The reader is a junior developer who can follow code but may not know the
patterns Stackpress uses.

Assume the reader:

 - wants to build something visible
 - benefits from direct explanation before framework vocabulary
 - needs to know why a concept exists before learning the API
 - can handle accurate technical language when it is introduced gradually
 - may be seeing Stackpress-specific ideas for the first time

Do not write down to the reader. Teach the reason, show the action, explain
the result, then add subtopics and variations.

## Teaching Goal

Every lesson should answer these questions:

 - What problem does this topic solve?
 - Why should a developer care about it?
 - What mental model makes it easier to understand?
 - What is the smallest useful thing the reader can see or change?
 - What changed after each step?
 - What should the reader understand by the end?

Avoid opening with `This page is for...`. That phrase describes the document,
not the student's problem. Start by framing the idea.

Weak opening:

```md
This page is for routes that need to send more than plain text.
```

Better opening:

```md
A route is only useful when it can answer clearly. Sometimes that answer is a
small JSON object, sometimes it is an HTML page, and sometimes it is a redirect
that tells the browser where to go next.
```

## Lesson Arc

Most lessons should follow this teaching arc, even when the headings differ.

### 1. Motivate The Topic

Start with the ordinary problem before naming the Stackpress API.

Good first paragraphs explain:

 - why this topic exists
 - where a developer runs into the problem
 - what confusion it prevents
 - what the reader will be able to do after the lesson

For example, a response lesson should begin with the problem of shaping an
answer, not with a list of methods. A plugin lesson should begin with the pain
of one file collecting unrelated behavior, not with a plugin definition.

### 2. Give A Mental Model

Use a metaphor, story, or simple comparison when the Stackpress concept is not
common in everyday web development.

Useful metaphor types:

 - **Container:** data surfaces are labeled boxes; each value needs the right
   box so future code knows what it means.
 - **Pipeline:** request handling is a path from incoming input to chosen
   output.
 - **Workshop:** generated code is a tool made from a blueprint; edit the
   blueprint, not the tool, when you want repeatable output.
 - **Reception desk:** a route receives the visitor, asks what they need, and
   sends them to the right result.
 - **Notebook margin:** response data can carry view notes without becoming the
   main payload.

Metaphors should clarify, not decorate. Use one short metaphor, then connect it
back to concrete code.

### 3. Start With A Simple Case

Show the smallest useful use case before introducing variations.

The simple case should:

 - change or add one thing
 - produce an obvious result
 - use real Stackpress method names
 - avoid optional branches unless the topic requires them

### 4. Walk Through The Simple Case

Do not present a large code block and leave the reader to infer what matters.
In the first simple use case, guide the reader through small additions and
explain each one.

Preferred rhythm:

 1. Point to the current file or idea.
 2. Add or change a small code fragment.
 3. Explain what that fragment does.
 4. Add the next fragment.
 5. Explain how the next fragment changes behavior.
 6. Verify the result.

This is not homework. It is a guided walkthrough inside the lesson. Use this
level of hand-holding when the reader is first forming the mental model.

Example pattern:

````md
First, look at the route again:

```ts
server.get('/health', ({ res }) => {
  res.json({ ok: true });
});
```

This route answers `GET /health` with JSON. The response body is an object with
one field, `ok`, so another program can parse the answer without guessing what
the text means.

Now change the response helper:

```ts
res.set('text/plain', 'OK');
```

What changed is the kind of answer the route sends. `res.json()` creates a
structured JSON response. `res.set('text/plain', 'OK')` sends a plain text body
with an explicit MIME type.
````

### 5. Add Subtopics And Variations After The Anchor

Once the reader understands the simple case, introduce related methods,
properties, alternate forms, tradeoffs, and edge cases.

Subtopics and variations belong after the first working mental anchor. Do not
lead with all valid options. For junior developers, too many choices before a
concrete example makes the lesson feel like a reference table.

These sections do not need the same small-change hand-holding unless the detail
is complicated. Lead into the subtopic, show a focused example, explain the
example, then move to the next subtopic.

Preferred rhythm:

 1. Introduce the subtopic and why it matters.
 2. Show one focused example.
 3. Explain what the example demonstrates.
 4. Connect it back to the main concept.
 5. Move to the next subtopic.

Example pattern:

````md
JSON is best when another program needs to read the response.

```ts
server.get('/status', ({ res }) => {
  res.json({ ok: true });
});
```

This example sends structured data instead of a plain string. A browser can
show it, but the more important point is that another client can parse it
without guessing what the response means.

HTML is different because the browser can render it directly.

```ts
server.get('/hello', ({ res }) => {
  res.html('<h1>Hello Stackpress</h1>');
});
```

Here the route is not returning data for another program. It is returning a
small page for the browser to display.
````

### 6. Reinforce What Was Learned

End by explaining what the walkthrough taught. This should be a short learning
recap, not just a next-link.

Useful recap questions:

 - What did the student change?
 - What behavior changed because of it?
 - What Stackpress concept did that reveal?
 - What should they recognize in the next lesson?

## Guided Walkthrough Style

Use guided walkthroughs for the first simple use case in practical pages. These
are small, connected changes with explanations between steps.

Do not call them exercises, homework, or practice tasks.

Recommended labels:

 - `Walk Through The Change`
 - `Try The Small Change`
 - `Change One Thing`
 - `Follow The Request`
 - `Trace The Output`
 - `Build The First Version`

The label should fit the page. A conceptual page might not need a walkthrough
section, but it should still include a small example. Subtopic and variation
sections usually use a lead-in, example, explanation rhythm instead of a
step-by-step walkthrough.

## Section Structure Rules

These rules apply to every content file. They are not suggestions for only
practical lessons or only conceptual lessons. They keep the writing from
looking like an outline that was expanded halfway.

Every heading must introduce content before it introduces another heading. Do
not place an H2 directly before an H3, or any heading directly before a lower
level heading. The reader needs a short paragraph that explains what the
section is about before the subsections begin.

If the parent section is mostly a container for subsections, add a real
orientation paragraph. The paragraph can summarize what the subsections will
cover, explain why those details belong together, or tell the reader how to
read the group.

Acceptable filler pattern:

```md
## Security Checks

This section discusses the checks that keep the flow from accepting unsafe
input. The subsections separate route protection, token handling, and failure
behavior so each concern is easier to inspect.

### Protect A Route
```

The filler still needs to teach. Avoid empty lines such as "This section will
discuss the following topics" unless the next sentence names the topics and
explains why they matter together.

Paragraphs should have at least two sentences, and three or more sentences are
often better for teaching context. A single-sentence line usually reads like a
note, label, or generated recap instead of a lesson. If a paragraph has only
one sentence, either expand the idea or combine it with the surrounding
paragraph.

Short labels, list items, commands, and code are allowed to be short. The
minimum sentence rule is for prose paragraphs that are trying to teach a
concept, transition, warning, or recap.

## Phrase Rotation

Repeated instruction phrases make docs sound generated. Rotate between a small
set of natural phrases so each lesson feels written by a person.

### Instruction Starters

Use these to introduce the next action:

 - `Start by looking at...`
 - `First, open...`
 - `Now add...`
 - `Next, change...`
 - `Then wire...`
 - `After that, check...`
 - `Once that is in place...`
 - `With that route added...`
 - `Try changing...`
 - `Run it again and look for...`

Do not use the same starter in every step. If two neighboring paragraphs start
the same way, rewrite one.

### Explanation Starters

Use these to explain what a change did:

 - `What this does is...`
 - `This gives Stackpress...`
 - `By adding this, the route now...`
 - `That matters because...`
 - `The important part is...`
 - `This should...`
 - `Behind that small line...`
 - `In plain terms...`
 - `Now the framework can...`
 - `The reason this works is...`

Do not force these phrases. They are a rotation bank, not required wording.

### Transition Starters

Use these to move from one idea to the next:

 - `That handles the simple case.`
 - `Now that the route can answer, look at...`
 - `The next question is...`
 - `This is where the distinction matters.`
 - `Once the data has a home...`
 - `With the basic flow working...`
 - `The same idea shows up again when...`
 - `Before adding more code, notice...`
 - `There is one detail worth slowing down for.`
 - `From here, the pattern becomes...`

Transitions should explain why the next section follows from the previous one.

### Recap Starters

Use these near the end of a lesson:

 - `You should now be able to...`
 - `The main thing to remember is...`
 - `In this lesson, the important shift was...`
 - `What you changed was small, but it showed...`
 - `This prepares you for...`
 - `You have seen the pattern:...`
 - `The next lesson builds on this by...`

Avoid ending only with a link. Give the student a learning checkpoint first.

## Repetition Rules

Repetition is useful for teaching patterns, but predictable wording feels
robotic.

When editing a file:

 - scan repeated paragraph openings
 - vary instruction starters
 - vary explanation starters
 - replace repeated `This page is for...` openings with a motivated overview
 - avoid using the same recap sentence across files
 - keep repeated API names exact even when prose changes

When multiple files teach related ideas, repeat the concept but change the
angle. For example:

 - request docs can describe input as "what the visitor brought"
 - response docs can describe output as "the answer the route sends back"
 - data surface docs can describe values as "items that need the right box"

The concept stays consistent, but the prose does not become a template.

## Opening Paragraph Pattern

A good opening usually has three parts:

 1. the real-world problem
 2. why the topic matters
 3. what the lesson will make clear

Example:

```md
When a browser asks your app for something, the route has to send back a clear
answer. A plain string might be enough for a health check, but a real app needs
JSON, HTML, redirects, errors, and page data. This lesson shows how Stackpress
keeps those response choices explicit so the next developer can tell what the
route is trying to do.
```

This is better than saying the page is "for routes that need response output"
because it gives the student a reason to care.

## Practical Walkthrough Pattern

Use this for the first simple use case where the reader changes code.

```md
Start by looking at the route you already have.

[code]

Now change one line.

[code]

What this does is...

Next, add...

[code]

By adding this...

Run the route again and check...

[expected result]
```

Keep each step small. If a code block has more than one new idea, split it or
explain the pieces immediately after the block.

Every example needs an explanation after it. Do not show code, a file path, a
diagram, a command, or a config snippet and then move directly to the next
heading. The student should always know what the example demonstrates and
which part of the example matters.

Example explanations should answer at least two of these questions:

 - What does this example do?
 - Which line or value should the student notice?
 - Why is this the right surface, method, or file?
 - What would change if the student used a different option?
 - How does this connect back to the current lesson?

## Subtopic Example Pattern

Use this after the simple use case, when the reader already has the main mental
model.

```md
[Lead into subtopic]

[example]

[Explain what the example shows]

[Transition to next subtopic]

[example]

[Explain what changed or why this version matters]
```

Subtopic examples can be shorter than walkthrough steps. The point is to make
the detail concrete, not to walk the reader through every keystroke again.

## Conceptual Lesson Pattern

Use this for pages that teach mental models more than code.

```md
[Motivating problem]

[Metaphor or story]

[Small concrete example]

[How Stackpress names the pieces]

[Where the distinction matters]

[Learning checkpoint]
```

Concept pages still need examples. The example can be a diagram, file shape, or
tiny code fragment instead of a full walkthrough.

## Accuracy Rules

Teaching voice must not weaken technical accuracy.

 - Use exact API names from `specs/` and sibling library specs.
 - Keep code examples syntactically realistic.
 - Do not invent guarantees or behavior to make the story smoother.
 - If a metaphor stops matching the real API, drop the metaphor.
 - Put caveats after the simple case, not before it, unless the caveat prevents
   a dangerous mistake.

## Anti-Patterns

Avoid these patterns:

 - starting every page with `This page is for...`
 - placing a heading directly before a subheading
 - leaving one-sentence prose paragraphs as standalone lines
 - opening with a list of methods before explaining the problem
 - presenting a big code block without walking through it
 - presenting any example without explaining it before moving on
 - using the same transition phrase repeatedly
 - ending with only `Read the next lesson`
 - turning every page into a reference table
 - using metaphors that are longer than the concept they explain
 - calling guided walkthroughs homework, exercises, or practice tasks

## Editing Checklist

Before finishing a lesson, check:

 - Does the opening convince the student why the topic matters?
 - Is there a mental model before heavy Stackpress vocabulary?
 - Does the first example stay small?
 - Are simple-use-case code changes explained between steps?
 - Do subtopic examples have a lead-in and explanation?
 - Does every heading have a following paragraph before any subheading?
 - Are prose paragraphs at least two sentences where they teach or transition?
 - Does every example have an explanation before the next heading?
 - Do transitions explain why the next idea follows?
 - Are repeated phrases rotated or rewritten?
 - Does the ending summarize what the student learned?
 - Are API names and behavior verified against current specs?
