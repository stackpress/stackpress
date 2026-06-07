# 411 Source Of Truth

Decide where a product change belongs before editing generated files. Keep the idea tied to the concrete project surface in this section.

**Previously:** The previous lesson, `350 Lambda / Serverless`, gave you the setup this page builds on. Here, the focus shifts to `Source Of Truth` so you can place the next Stackpress surface in the course path.

## 411.1. The Decision

A Stackpress project has files you edit, files you generate, and files you inspect. Knowing which file owns the truth prevents the common mistake of fixing generated output only to lose the change later.

## 411.2. Recommended Default

Use this map:

 - data model or generated admin behavior: `schema.idea`
 - runtime/build settings: `config/*`
 - app-specific route or event behavior: `plugins/*`
 - page UI: `plugins/*/views/*`
 - static assets: `public/*`
 - generated output: inspect, do not hand edit

## 411.3. Source Files

You separated authored source from generated artifacts. That prevents fixes from disappearing the next time generation runs.

## 411.4. Generated Files

This part of the Source Of Truth workflow is easier to follow when the smaller pieces are compared together. The subsections cover Authored Source, Generated Output, Product Change, so the reader can see how each piece changes the local decision.

### 411.4.1. Authored Source

Authored source is code or config you intentionally maintain. The example gives the decision enough context to evaluate it.

### 411.4.2. Generated Output

Generated output is created from authored source. It should be reproducible.

### 411.4.3. Product Change

A product change should start in the authored file that expresses the intent, not in the generated file where the effect appears. Use the check to make the idea visible before moving to the next topic.

## 411.5. Tradeoffs

This part of the Source Of Truth workflow is easier to follow when the smaller pieces are compared together. The subsections cover Add A Field, Change A Route, Change Branding, so the reader can see how each piece changes the local decision.

### 411.5.1. Add A Field

Edit `schema.idea`, then regenerate. The same idea shows up through inspectable project surfaces.

### 411.5.2. Change A Route

Edit the local plugin or page handler that registers or handles the route. Keep that role in mind as the lesson moves into the concrete shape.

### 411.5.3. Change Branding

Edit config and let view props carry the updated values into layouts. The nearby example or check shows the project detail affected by this idea.

## 411.6. Next Step

You do not need the full reference yet. For Source Of Truth, focus on recognizing the pattern and knowing where to look next.

Read `412 Generated Output` to inspect generated files safely. That page continues the course path with the next Stackpress surface.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `412 Generated Output`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
