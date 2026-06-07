# 750 Import / Export

Run or inspect structured data import and export flows. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

**Previously:** The previous lesson, `743 Admin Client`, gave you the setup this page builds on. Here, the focus shifts to `Import / Export` so you can place the next Stackpress surface in the course path.

## 750.1. When To Import Or Export

Import and export features move real data across boundaries, which makes them useful and risky. The safest habit is to inspect the flow before trusting it with production records.

## 750.2. Workflow

Before running an import:

 - confirm the target model
 - confirm expected fields
 - test with a small file
 - inspect validation errors
 - verify inserted or updated rows

For export, open the generated export route or admin action for the model and inspect the downloaded data. The same idea shows up through inspectable project surfaces.

## 750.3. Command Or UI Map

Import/export flows turn structured files into model data or model data into files. They depend on schema metadata, validation, generated actions, and browser-safe admin helpers.

## 750.4. Verify

This part of the Import / Export workflow is easier to follow when the smaller pieces are compared together. The subsections cover Import, Export, Batch, so the reader can see how each piece changes the local decision.

### 750.4.1. Import

Import reads external data and writes it into the app. The nearby check shows the project-level consequence.

### 750.4.2. Export

Export writes app data into a downloadable format. The example gives the idea a concrete file, command, or code shape.

### 750.4.3. Batch

Batch import should report per-row errors so one bad row does not hide the rest of the result. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

## 750.5. Common Failures

This part of the Import / Export workflow is easier to follow when the smaller pieces are compared together. The subsections cover Test With A Small File, Check Validation, Verify Data, so the reader can see how each piece changes the local decision.

### 750.5.1. Test With A Small File

Start with one or two rows before importing large data. That context prepares the reader for the more specific form that follows.

### 750.5.2. Check Validation

Import should respect required fields, formats, and relation constraints. Keep the idea tied to the concrete project surface in this section.

### 750.5.3. Verify Data

Run a query or open the admin search page after import. The nearby example or check shows the project detail affected by this idea.

## 750.6. Next Step

Use Import / Export as a guide for choosing which file, command, or generated output to inspect next. Compare the concrete details to see the app-level effect.

Move to `800 AI` when you are ready for advanced automation and inspection layers. The following example gives the idea a concrete project shape.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `811 stdio Transport`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
