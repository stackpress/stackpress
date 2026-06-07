# 741 Admin Pages

Find generated admin page routes and trace them back to model metadata. The example gives the decision enough context to evaluate it.

**Previously:** The previous lesson, `730 Relations`, gave you the setup this page builds on. Here, the focus shifts to `Admin Pages` so you can place the next Stackpress surface in the course path.

## 741.1. What You Are Looking For

Admin pages are generated workflows for managing model data. They are useful because search, detail, create, update, remove, restore, and export flows follow repeatable patterns.

## 741.2. Where Admin Pages Live

Check admin config:

```ts
export const admin = {
  name: 'Admin',
  base: '/admin',
  menu: [
    { name: 'Products', path: '/admin/product/search' }
  ]
};
```

Open:

```text
/admin/product/search
```

This example keeps the first version narrow on purpose. Once this shape is clear, the surrounding section can add options without making the first step harder to follow.

## 741.3. Inspect Routes

The admin base and generated model routes combine into admin URLs. Use the check to make the idea visible before moving to the next topic.

## 741.4. Expected Evidence

This part of the Admin Pages workflow is easier to follow when the smaller pieces are compared together. The subsections cover Admin Base, Generated Route, Menu Entry, so the reader can see how each piece changes the local decision.

### 741.4.1. Admin Base

The admin base is the route prefix for generated admin pages. The same idea shows up through inspectable project surfaces.

### 741.4.2. Generated Route

Generated routes come from model metadata and admin generation. Keep that role in mind as the lesson moves into the concrete shape.

### 741.4.3. Menu Entry

Static admin menu entries help users find generated pages. The nearby example or check shows the project detail affected by this idea.

## 741.5. Fix The Source

This part of the Admin Pages workflow is easier to follow when the smaller pieces are compared together. The subsections cover Add Menu Items, Verify Generated Routes, and Customize Carefully, so the reader can see how each piece changes the local decision.

### 741.5.1. Add Menu Items

Add a menu item for models that should be visible in admin navigation. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

### 741.5.2. Verify Generated Routes

Run generation and open search/detail routes for the model. The local example shows why that choice matters in an app.

### 741.5.3. Customize Carefully

Use local plugins or supported config instead of editing generated admin output directly. Compare the concrete details to see the practical meaning.

## 741.6. Next Step

The important part is the reason behind Admin Pages: it gives the app a clearer way to organize one kind of behavior. The nearby example or check shows the project detail affected by this idea.

Read `742 Admin Views` to inspect the generated view structure. That page continues the course path with the next Stackpress surface.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `742 Admin Views`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
