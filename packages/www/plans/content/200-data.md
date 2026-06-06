# 200 Data

Use this course to teach practical data access. The goal is not to document
every SQL builder method. The goal is to help developers connect to data, run
queries, and understand when generated stores or lower-level builders are the
right tool.

## 200 Data

Stackpress data work sits on top of database connections, dialect-aware SQL
behavior, engines, query builders, and generated stores.

**Checkpoint**

The reader can connect to local data and return records from a route.

## 210 Connections

A connection is the bridge between Stackpress and a database. Teach one local
path first, then explain production choices.

**Course work**

- configure one local connection
- verify that the app can query through it

## 211 Dialects

Dialects describe database differences. The reader needs this concept when they
move between SQLite/PGlite, PostgreSQL, and MySQL.

**Checkpoint**

The reader can choose a local and production database target.

## 212 SQLite / PGlite

SQLite or PGlite should be the recommended local path when it fits the app.

**Course work**

- run schema generation
- push schema changes
- populate starter data
- query the local database

## 213 PostgreSQL

PostgreSQL belongs in the course as a production path, not a driver reference.

**Course work**

- identify required connection settings
- switch from local data to PostgreSQL configuration

## 214 MySQL

MySQL belongs in the course when it is a supported deployment target.

**Course work**

- identify required connection settings
- understand practical differences from local SQLite/PGlite development

## 220 Engine

The engine is the starting point for building or running SQL. Teach it through
one query and one route.

**Checkpoint**

The reader can create or receive an engine and run a simple query.

## 221 Select

Select queries are the common read path for page rendering.

**Course work**

- select records
- map them into response results
- render them in a view

## 222 Insert

Insert queries create records from route or event work.

**Course work**

- validate input
- insert a row
- redirect or return the created data

## 223 Update

Update queries change existing records.

**Course work**

- find a row by ID or unique field
- update allowed fields
- return a success response

## 224 Delete

Delete queries remove records. Teach the workflow with clear confirmation and
permission context.

**Course work**

- delete one row from an action route
- return a safe redirect or response

## 230 Querying

Querying is the daily data workflow. The reader should learn how route code,
event handlers, generated stores, and lower-level builders fit together.

**Checkpoint**

The reader can query, map, and return typed records.

## 231 Raw SQL

Raw SQL is a side path for cases builders do not cover.

Teach when to use it, not every interpolation rule.

**Course work**

- run one raw query
- understand why the builder was not enough

## 232 Transactions

Transactions group dependent changes so partial updates do not leave data in a
bad state.

**Course work**

- wrap two dependent writes in a transaction
- handle an error path

## 233 JSON Fields

JSON fields are useful for flexible metadata. Teach one storage and one filter
example.

**Course work**

- store metadata
- filter by a nested value
- know when to switch to reference for selector details

## 234 Schema Changes

Schema changes should flow through Stackpress generation and push workflows
where possible.

**Course work**

- add a field
- regenerate
- push schema changes
- verify existing data remains readable

## Related Reference

- SQL reference
- SQLite reference
- PGlite reference
- PostgreSQL reference
- MySQL reference
- CLI reference

