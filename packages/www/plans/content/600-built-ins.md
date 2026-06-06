# 600 Built-ins

Use this course to introduce batteries-included features after the reader
understands runtime, schema, and generation. Built-ins should feel like tools
the developer can opt into, not proof that Stackpress is trying to do everything
at first sight.

## 600 Built-ins

Built-ins cover common app needs:

- authentication
- roles and permissions
- sessions and account pages
- CSRF
- email
- i18n
- components
- API/OAuth

**Checkpoint**

The reader can decide which built-ins belong in their app.

## 610 Authentication

Authentication is the set of flows that identify a user and create session
state.

**Course work**

- configure and inspect one sign-in flow
- understand where auth pages and events fit

## 611 Sign In

Sign-in can support configured identifiers such as username, email, or phone.

**Course work**

- enable or inspect one sign-in path
- trace the route and event sequence

## 612 Sign Up

Sign-up creates account or profile state.

**Course work**

- enable or inspect account creation
- understand how profile data is stored

## 613 OTP / 2FA

OTP and 2FA extend sign-in with a second verification step.

**Course work**

- trace the OTP/2FA flow
- identify where email, auth, session, and CSRF behavior meet

## 620 Roles And Permissions

Roles are profile/session state used to protect behavior.

**Course work**

- add or inspect a role
- protect route or event behavior with session rules

## 621 Session Rules

Session rules describe access at a practical level. Keep matcher internals in
reference.

**Course work**

- define or inspect a rule that protects a route

## 630 Sessions And Account

Sessions connect the active user to runtime and view behavior.

**Course work**

- read the active profile
- read session state in route/view code

## 631 Profile

The profile model stores user-facing account data and roles.

**Course work**

- inspect profile behavior
- extend profile-facing behavior when needed

## 632 Account Pages

Account pages expose common user workflows.

**Course work**

- link to account pages
- customize account behavior through the supported extension points

## 633 Flash Messages

Flash messages are session-backed feedback after redirects.

**Course work**

- set a flash message
- render it through notifier behavior

## 640 CSRF

CSRF protection belongs in form and action flows.

**Course work**

- add or inspect a protected form action
- understand where the token is generated and validated

## 650 Email

Email is commonly used by auth and account workflows, but it can also support
general transactional messages.

**Course work**

- send or inspect one transactional email event

## 660 i18n

i18n connects language config, server props, layouts, and view hooks.

**Course work**

- add a locale
- translate a view string

## 661 Language Config

Language config is the source of truth for available locales and translation
maps.

**Course work**

- configure a default language
- add one alternate locale

## 662 useLanguage

`useLanguage()` is the normal view hook for translating text inside a component
that lives below the layout provider.

**Course work**

- translate content inside `Body` or a child component

## 670 Components

Components help Stackpress render forms, display values, and build page
interfaces consistently.

## 671 frui Base Components

Base components include pieces such as buttons, cards, dialogs, dropdowns,
tabs, tables, and notifications.

**Course work**

- use one base component in a view

## 672 frui Form Components

Form components provide input controls that can pair with schema metadata and
generated admin behavior.

**Course work**

- use or inspect a form component tied to schema metadata

## 673 frui View Components

View components display formatted values such as dates, images, links, numbers,
HTML, markdown, lists, and tags.

**Course work**

- render typed data with an appropriate display component

## 680 API / OAuth

API and OAuth surfaces support integrations and external clients.

**Course work**

- configure or inspect one API/OAuth flow

## Related Reference

- Session reference
- Language reference
- View Client reference
- Frui component reference
- Email reference
- API reference

