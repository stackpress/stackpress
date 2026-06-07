# 842 App Discovery Skill

Use `stackpress-app-discovery` to turn a vague product request into a buildable app brief. The nearby example or check shows the project detail affected by this idea.

**Previously:** The previous lesson, `841 Skill Workflow`, gave you the setup this page builds on. Here, the focus shifts to `App Discovery Skill` so you can place the next Stackpress surface in the course path.

## 842.1. Skill Purpose

A product idea is not buildable until the important pieces are named. App discovery turns a vague request into a brief with audience, entities, flows, auth, admin, and custom behavior.

## 842.2. Use It When

Use discovery to answer:

 - who uses the app
 - what entities the app manages
 - what flows users complete
 - whether auth is guest, optional, or required
 - what admin behavior is needed
 - what custom behavior goes beyond generated CRUD

## 842.3. Inputs

The product request became implementation-ready context. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

## 842.4. What It Produces

This part of the App Discovery Skill workflow is easier to follow when the smaller pieces are compared together. The subsections cover App Brief, Entity, Flow, so the reader can see how each piece changes the local decision.

### 842.4.1. App Brief

An app brief is a handoff artifact. It should be concrete enough for schema and plugin work.

### 842.4.2. Entity

An entity is a model candidate, such as Product, Order, Article, or Profile. The local example shows why that choice matters in an app.

### 842.4.3. Flow

A flow is the user path through routes, forms, views, and data changes. Compare the concrete details to see the practical meaning.

## 842.5. Handoff

This part of the App Discovery Skill workflow is easier to follow when the smaller pieces are compared together. The subsections cover Clarify Auth, Clarify Admin, Clarify Custom Behavior, so the reader can see how each piece changes the local decision.

### 842.5.1. Clarify Auth

Decide whether users are guests, signed-in users, admins, or several roles. The examples stay practical by tying the idea to something you can run, change, or verify.

### 842.5.2. Clarify Admin

Decide which models need generated admin behavior. That is why this detail appears in the lesson before reference material.

### 842.5.3. Clarify Custom Behavior

Identify email, payments, webhooks, search, dashboards, or integrations early. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

## 842.6. Verification

This gives you the first mental handle for App Discovery Skill; later pages can add more detail without starting from zero. The same idea shows up through inspectable project surfaces.

**Next step:** Read `843 App Coordinator Skill` to sequence the build after discovery. Read it as the continuation of the course sequence, not as a standalone lookup page.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `843 App Coordinator Skill`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
