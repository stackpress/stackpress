# Incept

Incept is a content management framework.

## Usage

See [Example](https://github.com/stackpress/incept/tree/main/example) 
for use case.

## Model Spec

The following attributes can be applied to model types in an idea file.

```js
model User @icon("user") @label("User" "Users") {}
```

<table cellspacing="0" cellpadding="0" border="1">
  <thead>
    <tr>
      <th align="left">Attribute</th>
      <th align="left">Description</th>
      <th align="left">Attributes</th>
      <th align="left">Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>@icon(string)</code></td>
      <td>An icon representation of a model. Uses font awesome names.</td>
      <td>&nbsp;</td>
      <td style="white-space:nowrap"><code>@icon("user")</code></td>
    </tr>
    <tr>
      <td><code>@template(string)</code></td>
      <td>Used to describe each row in a model</td>
      <td>&nbsp;</td>
      <td style="white-space:nowrap"><code>@template("User {{name}}")</code></td>
    </tr>
    <tr>
      <td><code>@label(string string)</code></td>
      <td>A friendly name that represents the model</td>
      <td>&nbsp;</td>
      <td style="white-space:nowrap"><code>@label("User" "Users")</code></td>
    </tr>
    <tr>
      <td><code>@active</code></td>
      <td>
        A flag that represents the active field. Active fields are 
        changed when deleting or restoring a row, as an alternative to 
        actually deleting the row in the database.
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td><code>@default(string|number|boolean)</code></td>
      <td>
        The default value applied when creating a row if no value 
        was provided.
      </td>
      <td>&nbsp;</td>
      <td style="white-space:nowrap">
        <code>@default(1)</code>
        <br /><code>@default("user")</code>
        <br /><code>@default(true)</code>
        <br /><code>@default("now()")</code>
        <br /><code>@default("nanoid()")</code>
        <br /><code>@default("nanoid(10)")</code>
        <br /><code>@default("cuid()")</code>
        <br /><code>@default("cuid(10)")</code>
      </td>
    </tr>
    <tr>
      <td><code>@generated</code></td>
      <td>
        A flag that represents that the value of this column is 
        generated, bypassing the need to be validated
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td><code>@id</code></td>
      <td>
        A flag that represents the models identifier. If multiple ids 
        then the combination will be used to determine each rows 
        uniqueness.
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td><code>@searchable</code></td>
      <td>
        A flag deonoting this column is searchable and will be 
        considered in a search field for example. Also used to know 
        which columns need to be optimized in the database.
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td><code>@sortable</code></td>
      <td>
        A flag deonoting this column is sortable. Also used to know 
        which columns need to be optimized in the database.
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td><code>@label(string)</code></td>
      <td>
        A label that will be shown to represent this column instead of 
        the actual column name.
      </td>
      <td>&nbsp;</td>
      <td style="white-space:nowrap"><code>@label("Name")</code></td>
    </tr>
    <tr>
      <td><code>@min(number)</code></td>
      <td>
        The minimum number value that will be accepted. This is also a 
        consideration when determining the database type.
      </td>
      <td>&nbsp;</td>
      <td style="white-space:nowrap"><code>@min(10)</code></td>
    </tr>
    <tr>
      <td><code>@max(number)</code></td>
      <td>
        The maximum number value that will be accepted. This is also a 
        consideration when determining the database type.
      </td>
      <td>&nbsp;</td>
      <td style="white-space:nowrap"><code>@max(100)</code></td>
    </tr>
    <tr>
      <td><code>@step(number)</code></td>
      <td>
        The incremental amount value that will be used when changing 
        the columns value. This is also a consideration when determining 
        the database type.
      </td>
      <td>&nbsp;</td>
      <td style="white-space:nowrap">
        <code>@step(1)</code>
        <br /><code>@step(0.01)</code>
      </td>
    </tr>
    <tr>
      <td><code>@relation(config)</code></td>
      <td>Maps columns in the model that is related to another model.</td>
      <td style="white-space:nowrap">
        local: string
        <br />foreign: string
        <br />name?: string
      </td>
      <td style="white-space:nowrap">
        <code>@relation({ local "userId" foreign "id" })</code>
        <br /><code>@relation({ name "memberships" local "ownerId" foreign "id" })</code>
        <br /><code>@relation({ name "connections" local "memberId" foreign "id" })</code>
      </td>
    </tr>
    <tr>
      <td><code>@unique</code></td>
      <td>
        A flag that ensures no duplicate value can be added to the model
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td><code>@updated</code></td>
      <td>
        A flag that will automatically update the timestamp whenever 
        a row is changed.
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
  </tbody>
</table>

## Validation Spec

The following validation attributes can be applied to model columns in an idea file.

```js
name String @is.required @is.cgt(10)
```

<table cellspacing="0" cellpadding="0" border="1">
  <thead>
    <tr>
      <th align="left">Attribute</th>
      <th align="left">Description</th>
      <th align="left">Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>@is.required</code></td>
      <td>Validates that a value must be given before being inserted.</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td><code>@is.notempty</code></td>
      <td>
        Validates that a value is something as opposed to an empty string.
      </td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td><code>@is.eq(string|number)</code></td>
      <td>
        Validates that the value is explicitly equal to the given argument
      </td>
      <td style="white-space:nowrap">
        <code>@is.eq(10)</code>
        <br /><code>@is.eq("foobar")</code>
      </td>
    </tr>
    <tr>
      <td><code>@is.ne(string|number)</code></td>
      <td>
        Validates that the value is explicitly not equal to the given argument
      </td>
      <td style="white-space:nowrap">
        <code>@is.neq(10)</code>
        <br /><code>@is.neq("foobar")</code>
      </td>
    </tr>
    <tr>
      <td><code>@is.option(string|number[])</code></td>
      <td>Validates that the value is one of the given options</td>
      <td style="white-space:nowrap"><code>@is.option([ 1 2 "foo" 3 "bar" ])</code></td>
    </tr>
    <tr>
      <td><code>@is.regex(string)</code></td>
      <td>
        Validates that the value matches the given regular expression
      </td>
      <td style="white-space:nowrap"><code>@is.regex("[a-z]$")</code></td>
    </tr>
    <tr>
      <td><code>@is.date</code></td>
      <td>Validates that the value is a date</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td><code>@is.future</code></td>
      <td>Validates that the value is a future date</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td><code>@is.past</code></td>
      <td>Validates that the value is a past date</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td><code>@is.present</code></td>
      <td>Validates that the value is the present date</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td><code>@is.gt(number)</code></td>
      <td>Validate that the value is greater than the given number</td>
      <td style="white-space:nowrap"><code>@is.gt(10)</code></td>
    </tr>
    <tr>
      <td><code>@is.ge(number)</code></td>
      <td>
        Validate that the value is greater than or equal to the given number
      </td>
      <td style="white-space:nowrap"><code>@is.ge(10)</code></td>
    </tr>
    <tr>
      <td><code>@is.lt(number)</code></td>
      <td>Validate that the value is less than the given number</td>
      <td style="white-space:nowrap"><code>@is.lt(10)</code></td>
    </tr>
    <tr>
      <td><code>@is.le(number)</code></td>
      <td>
        Validate that the value is less than or equal to the given number
      </td>
      <td style="white-space:nowrap"><code>@is.le(10)</code></td>
    </tr>
    <tr>
      <td><code>@is.ceq(number)</code></td>
      <td>
        Validate that the character count of the value 
        is equal to the given number
      </td>
      <td style="white-space:nowrap"><code>@is.ceq(10)</code></td>
    </tr>
    <tr>
      <td><code>@is.cgt(number)</code></td>
      <td>
        Validate that the character count of the value is greater 
        than or equal to the given number
      </td>
      <td style="white-space:nowrap"><code>@is.cle(10)</code></td>
    </tr>
    <tr>
      <td><code>@is.cge(number)</code></td>
      <td>
        Validate that the character count of the value is 
        less than the given number
      </td>
      <td style="white-space:nowrap"><code>@is.cge(10)</code></td>
    </tr>
    <tr>
      <td><code>@is.clt(number)</code></td>
      <td>
        Validate that the character count of the value is 
        less than or equal to the given number
      </td>
      <td style="white-space:nowrap"><code>@is.clt(10)</code></td>
    </tr>
    <tr>
      <td><code>@is.cle(number)</code></td>
      <td>
        Validate that the character count of the value is less 
        than or equal to the given number
      </td>
      <td style="white-space:nowrap"><code>@is.cle(10)</code></td>
    </tr>
    <tr>
      <td><code>@is.weq(number)</code></td>
      <td>
        Validate that the word count of the value is 
        equal to the given number
      </td>
      <td style="white-space:nowrap"><code>@is.weq(10)</code></td>
    </tr>
    <tr>
      <td><code>@is.wgt(number)</code></td>
      <td>
        Validate that the word count of the value is greater 
        than or equal to the given number
      </td>
      <td style="white-space:nowrap"><code>@is.wle(10)</code></td>
    </tr>
    <tr>
      <td><code>@is.wge(number)</code></td>
      <td>
        Validate that the word count of the value is less 
        than the given number
      </td>
      <td style="white-space:nowrap"><code>@is.wge(10)</code></td>
    </tr>
    <tr>
      <td><code>@is.wlt(number)</code></td>
      <td>
        Validate that the word count of the value is less than 
        or equal to the given number
      </td>
      <td style="white-space:nowrap"><code>@is.wlt(10)</code></td>
    </tr>
    <tr>
      <td><code>@is.wle(number)</code></td>
      <td>
        Validate that the word count of the value is less than 
        or equal to the given number
      </td>
      <td style="white-space:nowrap"><code>@is.wle(10)</code></td>
    </tr>
    <tr>
      <td><code>@is.cc</code></td>
      <td>Validates that the value is a credit card</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td><code>@is.color</code></td>
      <td>Validates that the value is a color value (color name or hex)</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td><code>@is.email</code></td>
      <td>Validates that the value is an email</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td><code>@is.hex</code></td>
      <td>Validates that the value is a hexidecimal</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td><code>@is.price</code></td>
      <td>Validates that the value is a price number (ie. 2 decimal numbers)</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td><code>@is.url</code></td>
      <td>Validates that the value is a URL</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td><code>@is.boolean</code></td>
      <td>Validates that the value is a boolean</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td><code>@is.number</code></td>
      <td>Validates that the value is a number format</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td><code>@is.float</code></td>
      <td>Validates that the value is a float format</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td><code>@is.integer</code></td>
      <td>Validates that the value is an integer format</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td><code>@is.object</code></td>
      <td>Validates that the value is an object</td>
      <td>&nbsp;</td>
    </tr>
  </tbody>
</table>

## Field Spec

The following fields can be applied to model columns in an idea file.

```js
name String @field.text
```

<table cellspacing="0" cellpadding="0" border="1">
  <thead>
    <tr>
      <th align="left">Attribute</th>
      <th align="left">Description</th>
      <th align="left">Attributes</th>
      <th align="left">Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>@field.color</code></td>
      <td>Use a color field to represent this column in a form</td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@field.checkbox(attributes?)</code></td>
      <td>Use a checkbox to represent this column in a form</td>
      <td style="white-space:nowrap">
        label: string 
        <br />check: boolean 
        <br />circle: boolean
        <br />square: boolean
        <br />rounded: boolean
        <br />blue: boolean
        <br />orange: boolean
      </td>
      <td style="white-space:nowrap">
        <code>@field.checkbox</code>
        <br /><code>@field.checkbox({ label "Enabled" circle true })</code>
      </td>
    </tr>
    <tr>
      <td><code>@field.country(attributes?)</code></td>
      <td>Use a country dropdown to represent this column in a form</td>
      <td style="white-space:nowrap">placeholder: string</td>
      <td style="white-space:nowrap">
        <code>@field.country</code>
        <br /><code>@field.country({ placeholder "Select Country" })</code>
      </td>
    </tr>
    <tr>
      <td><code>@field.currency(attributes?)</code></td>
      <td>Use a currency dropdown to represent this column in a form</td>
      <td style="white-space:nowrap">placeholder: string</td>
      <td style="white-space:nowrap">
        <code>@field.currency</code>
        <br /><code>@field.currency({ placeholder "Select Currency" })</code>
      </td>
    </tr>
    <tr>
      <td><code>@field.date</code></td>
      <td>Use a date field to represent this column in a form</td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@field.datetime</code></td>
      <td>Use a date time field to represent this column in a form</td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@field.editor(attributes?)</code></td>
      <td>Use a code editor to represent this column in a form</td>
      <td style="white-space:nowrap">
        lang: html|md|css|js|ts
        <br />numbers: boolean
      </td>
      <td style="white-space:nowrap">
        <code>@field.editor</code>
        <br /><code>@field.editor({ lang "html" numbers true })</code>
      </td>
    </tr>
    <tr>
      <td><code>@field.file</code></td>
      <td>Use a file input to represent this column in a form</td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@field.filelist</code></td>
      <td>Use a file list fieldset to represent this column in a form</td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@field.input</code></td>
      <td>Use an input field to represent this column in a form</td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@field.markdown(attributes?)</code></td>
      <td>Use a markdown editor to represent this column in a form</td>
      <td style="white-space:nowrap">numbers: boolean</td>
      <td style="white-space:nowrap">
        <code>@field.markdown</code>
        <br /><code>@field.markdown({ numbers true })</code>
      </td>
    </tr>
    <tr>
      <td><code>@field.mask(attributes)</code></td>
      <td>Use an input mask to represent this column in a form</td>
      <td style="white-space:nowrap">mask: string</td>
      <td style="white-space:nowrap">
        <code>@field.mask</code>
        <br /><code>@field.mask({ mask "999-999-999" })</code>
      </td>
    </tr>
    <tr>
      <td><code>@field.metadata</code></td>
      <td>Use a key value fieldset to represent this column in a form</td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@field.number(attributes?)</code></td>
      <td>Uses a number field to represent this column in a form</td>
      <td style="white-space:nowrap">
        min: number
        <br />max: number
        <br />step: number
        <br />separator: string 
        <br />decimal: string
        <br />absolute: boolean
      </td>
      <td style="white-space:nowrap">
        <code>@field.number</code>
        <br /><code>@field.number({ min 0 max 10 step 0.01 separator "," decimal "." absolute true })</code>
      </td>
    </tr>
    <tr>
      <td><code>@field.password</code></td>
      <td>Uses a password field to represent this column in a form</td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@field.range(attributes?)</code></td>
      <td>Uses a range field to represent this column in a form</td>
      <td style="white-space:nowrap">
        min: number
        <br />max: number
        <br />step: number
        <br />width: number
      </td>
      <td style="white-space:nowrap">
        <code>@field.range</code>
        <br /><code>@field.range({ min 0 max 10 step 0.01 width 100 })</code>
      </td>
    </tr>
    <tr>
      <td><code>@field.rating(attributes?)</code></td>
      <td>Uses a rating field to represent this column in a form</td>
      <td style="white-space:nowrap">max: number</td>
      <td style="white-space:nowrap">
        <code>@field.rating</code>
        <br /><code>@field.rating({ max 5 })</code>
      </td>
    </tr>
    <tr>
      <td><code>@field.select(attributes?)</code></td>
      <td>Uses a select dropdown to represent this column in a form</td>
      <td style="white-space:nowrap">placeholder: string</td>
      <td style="white-space:nowrap">
        <code>@field.select</code>
        <br /><code>@field.select({ placeholder "Select Country" })</code>
      </td>
    </tr>
    <tr>
      <td><code>@field.slug</code></td>
      <td>
        Uses an input field that transforms the value 
        into a slug to represent this column in a form
      </td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@field.switch(attributes?)</code></td>
      <td>Uses a switch toggle to represent this column in a form</td>
      <td style="white-space:nowrap">
        rounded: boolean
        <br />onoff: boolean
        <br />yesno: boolean
        <br />checkex: boolean
        <br />sunmoon: boolean
        <br />ridge: boolean
        <br />smooth: boolean
        <br />blue: boolean
        <br />orange: boolean
        <br />green: boolean
      </td>
      <td style="white-space:nowrap">
        <code>@field.switch</code>
        <br /><code>@field.switch({ label "Enabled" yesno true })</code>
      </td>
    </tr>
    <tr>
      <td><code>@field.textarea(attributes?)</code></td>
      <td>Uses a textarea field to represent this column in a form</td>
      <td style="white-space:nowrap">rows: number</td>
      <td style="white-space:nowrap">
        <code>@field.textarea</code>
        <br /><code>@field.textarea({ rows 10 })</code>
      </td>
    </tr>
    <tr>
      <td><code>@field.taglist</code></td>
      <td>Uses a tag field to represent this column in a form</td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@field.textlist</code></td>
      <td>Uses a text list fieldset to represent this column in a form</td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@field.time</code></td>
      <td>Uses a time field to represent this column in a form</td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@field.wysiwyg(attributes?)</code></td>
      <td>Uses a WYSIWYG to represent this column in a form</td>
      <td style="white-space:nowrap">
        history: boolean
        <br />font: boolean
        <br />size: boolean
        <br />format: boolean
        <br />paragraph: boolean
        <br />blockquote: boolean
        <br />style: boolean
        <br />color: boolean
        <br />highlight: boolean
        <br />text: boolean
        <br />remove: boolean
        <br />indent: boolean
        <br />align: boolean
        <br />rule: boolean
        <br />list: boolean
        <br />lineheight: boolean
        <br />table: boolean
        <br />link: boolean
        <br />image: boolean
        <br />video: boolean
        <br />audio: boolean
        <br />fullscreen: boolean
        <br />showblocks: boolean
        <br />code: boolean
        <br />dir: boolean
      </td>
      <td style="white-space:nowrap">
        <code>@field.wysiwyg</code>
        <br /><code>@field.wysiwyg({ font true size true format true })</code>
      </td>
    </tr>
  </tbody>
</table>

## Filter Spec

The following filter fields can be applied to model columns in an idea file.

```js
name String @field.text
```

<table cellspacing="0" cellpadding="0" border="1">
  <thead>
    <tr>
      <th align="left">Attribute</th>
      <th align="left">Description</th>
      <th align="left">Attributes</th>
      <th align="left">Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>@filter.color</code></td>
      <td>Use a color field to represent this column in a filter form</td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@filter.checkbox(attributes?)</code></td>
      <td>Use a checkbox to represent this column in a filter form</td>
      <td style="white-space:nowrap">
        label: string 
        <br />check: boolean 
        <br />circle: boolean
        <br />square: boolean
        <br />rounded: boolean
        <br />blue: boolean
        <br />orange: boolean
      </td>
      <td style="white-space:nowrap">
        <code>@filter.checkbox</code>
        <br /><code>@filter.checkbox({ label "Enabled" circle true })</code>
      </td>
    </tr>
    <tr>
      <td><code>@filter.country(attributes?)</code></td>
      <td>Use a country dropdown to represent this column in a filter form</td>
      <td style="white-space:nowrap">placeholder: string</td>
      <td style="white-space:nowrap">
        <code>@filter.select</code>
        <br /><code>@filter.select({ placeholder "Select Country" })</code>
      </td>
    </tr>
    <tr>
      <td><code>@filter.currency(attributes?)</code></td>
      <td>Use a currency dropdown to represent this column in a filter form</td>
      <td style="white-space:nowrap">placeholder: string</td>
      <td style="white-space:nowrap">
        <code>@filter.currency</code>
        <br /><code>@filter.currency({ placeholder "Select Currency" })</code>
      </td>
    </tr>
    <tr>
      <td><code>@filter.date</code></td>
      <td>Use a date field to represent this column in a filter form</td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@filter.datetime</code></td>
      <td>Use a date time field to represent this column in a filter form</td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@filter.file</code></td>
      <td>Use a file input to represent this column in a filter form</td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@filter.input</code></td>
      <td>Use an input field to represent this column in a filter form</td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@filter.mask(attributes)</code></td>
      <td>Use an input mask to represent this column in a filter form</td>
      <td style="white-space:nowrap">mask: string</td>
      <td style="white-space:nowrap">
        <code>@filter.mask</code>
        <br /><code>@filter.mask({ mask "999-999-999" })</code>
      </td>
    </tr>
    <tr>
      <td><code>@filter.number(attributes?)</code></td>
      <td>Uses a number field to represent this column in a filter form</td>
      <td style="white-space:nowrap">
        min: number
        <br />max: number
        <br />step: number
        <br />separator: string 
        <br />decimal: string
        <br />absolute: boolean
      </td>
      <td style="white-space:nowrap">
        <code>@filter.number</code>
        <br /><code>@filter.number({ min 0 max 10 step 0.01 separator "," decimal "." absolute true })</code>
      </td>
    </tr>
    <tr>
      <td><code>@filter.password</code></td>
      <td>Uses a password field to represent this column in a filter form</td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@filter.range(attributes?)</code></td>
      <td>Uses a range field to represent this column in a filter form</td>
      <td style="white-space:nowrap">
        min: number
        <br />max: number
        <br />step: number
        <br />width: number
      </td>
      <td style="white-space:nowrap">
        <code>@filter.range</code>
        <br /><code>@filter.range({ min 0 max 10 step 0.01 width 100 })</code>
      </td>
    </tr>
    <tr>
      <td><code>@filter.rating(attributes?)</code></td>
      <td>Uses a rating field to represent this column in a filter form</td>
      <td style="white-space:nowrap">max: number</td>
      <td style="white-space:nowrap">
        <code>@filter.rating</code>
        <br /><code>@filter.rating({ max 5 })</code>
      </td>
    </tr>
    <tr>
      <td><code>@filter.select(attributes?)</code></td>
      <td>Uses a select dropdown to represent this column in a filter form</td>
      <td style="white-space:nowrap">placeholder: string</td>
      <td style="white-space:nowrap">
        <code>@filter.select</code>
        <br /><code>@filter.select({ placeholder "Select Country" })</code>
      </td>
    </tr>
    <tr>
      <td><code>@filter.slug</code></td>
      <td>
        Uses an input field that transforms the value into a slug to 
        represent this column in a filter form
      </td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@filter.switch(attributes?)</code></td>
      <td>Uses a switch toggle to represent this column in a filter form</td>
      <td style="white-space:nowrap">
        rounded: boolean
        <br />onoff: boolean
        <br />yesno: boolean
        <br />checkex: boolean
        <br />sunmoon: boolean
        <br />ridge: boolean
        <br />smooth: boolean
        <br />blue: boolean
        <br />orange: boolean
        <br />green: boolean
      </td>
      <td style="white-space:nowrap">
        <code>@filter.switch</code>
        <br /><code>@filter.switch({ label "Enabled" yesno true })</code>
      </td>
    </tr>
    <tr>
      <td><code>@filter.time</code></td>
      <td>Uses a time field to represent this column in a filter form</td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
  </tbody>
</table>

### Spans

<table cellspacing="0" cellpadding="0" border="1">
  <thead>
    <tr>
      <th align="left">Attribute</th>
      <th align="left">Description</th>
      <th align="left">Attributes</th>
      <th align="left">Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>@span.date</code></td>
      <td>
        Use a pair of date fields as a span to represent 
        this column in a filter form
      </td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@span.datetime</code></td>
      <td>
        Use a pair of date time fields as a span to represent 
        this column in a filter form
      </td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@span.input</code></td>
      <td>
        Use a pair of input fields as a span to represent 
        this column in a filter form
      </td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@span.number(attributes?)</code></td>
      <td>
        Use a pair of number fields as a span to represent 
        this column in a filter form
      </td>
      <td style="white-space:nowrap">
        min: number
        <br />max: number
        <br />step: number
        <br />separator: string 
        <br />decimal: string
        <br />absolute: boolean
      </td>
      <td style="white-space:nowrap">
        <code>@span.number</code>
        <br /><code>@span.number({ min 0 max 10 step 0.01 separator "," decimal "." absolute true })</code>
      </td>
    </tr>
    <tr>
      <td><code>@span.range(attributes?)</code></td>
      <td>Use a range field as a span to represent this column in a filter form</td>
      <td style="white-space:nowrap">
        min: number
        <br />max: number
        <br />step: number
        <br />width: number
      </td>
      <td style="white-space:nowrap">
        <code>@span.range</code>
        <br /><code>@span.range({ min 0 max 10 step 0.01 width 100 })</code>
      </td>
    </tr>
    <tr>
      <td><code>@span.rating(attributes?)</code></td>
      <td>
        Use a pair of rating fields as a span to represent 
        this column in a filter form
      </td>
      <td style="white-space:nowrap">max: number</td>
      <td style="white-space:nowrap">
        <code>@span.rating</code>
        <br /><code>@span.rating({ max 5 })</code>
      </td>
    </tr>
    <tr>
      <td><code>@span.select(attributes?)</code></td>
      <td>Use a pair of select dropdowns as a span to represent this column in a filter form</td>
      <td style="white-space:nowrap">placeholder: string</td>
      <td style="white-space:nowrap">
        <code>@span.select</code>
        <br /><code>@span.select({ placeholder "Select Country" })</code>
      </td>
    </tr>
    <tr>
      <td><code>@span.time</code></td>
      <td>
        Use a pair of time fields as a span to represent this 
        column in a filter form
      </td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
  </body>
</table>

## List Spec

The following list format fields can be applied to model columns in an idea file.

```js
created Datetime @list.date({ locale "en" })
```

<table cellspacing="0" cellpadding="0" border="1">
  <thead>
    <tr>
      <th align="left">Attribute</th>
      <th align="left">Description</th>
      <th align="left">Attributes</th>
      <th align="left">Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>@list.hide</code></td>
      <td>Hides this column in a formatted list of results</td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@list.code(attributes?)</code></td>
      <td>
        Uses a code format to represent this column in a 
        formatted list of results
      </td>
      <td style="white-space:nowrap">
        lang: string
        <br />numbers: boolean 
        <br />inline: boolean
        <br />trim: boolean
        <br />ltrim: boolean
        <br />rtrim: boolean
      </td>
      <td style="white-space:nowrap">
        <code>@list.code</code>
        <br /><code>@list.code(lang "en" trim true)</code>
      </td>
    </tr>
    <tr>
      <td><code>@list.color(attributes?)</code></td>
      <td style="white-space:nowrap">
        Uses a code color to represent this column in a 
        formatted list of results
      </td>
      <td>box: boolean<br />text: boolean</td>
      <td style="white-space:nowrap">
        <code>@list.color</code>
        <br /><code>@list.color(box true text true)</code>
      </td>
    </tr>
    <tr>
      <td><code>@list.country(attributes?)</code></td>
      <td>
        Uses a country format to represent this column 
        in a formatted list of results
      </td>
      <td style="white-space:nowrap">flag: boolean<br />text: boolean</td>
      <td style="white-space:nowrap">
        <code>@list.country</code>
        <br /><code>@list.country(flag true text true)</code>
      </td>
    </tr>
    <tr>
      <td><code>@list.currency(attributes?)</code></td>
      <td>
        Uses a currency format to represent this column 
        in a formatted list of results
      </td>
      <td style="white-space:nowrap">
        flag: boolean
        <br />text: boolean
      </td>
      <td style="white-space:nowrap">
        <code>@list.currency</code>
        <br /><code>@list.currency(flag true text true)</code>
      </td>
    </tr>
    <tr>
      <td><code>@list.date(attributes?)</code></td>
      <td>
        Uses a date format to represent this column 
        in a formatted list of results
      </td>
      <td style="white-space:nowrap">
        locale: string
        <br />format: string
      </td>
      <td style="white-space:nowrap">
        <code>@list.date</code>
        <br /><code>@list.date(locale "en" format "MMMM D, YYYY, h:mm:ss a")</code>
      </td>
    </tr>
    <tr>
      <td><code>@list.email</code></td>
      <td>
        Uses an email format to represent this column in a 
        formatted list of results
      </td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@list.formula(attributes)</code></td>
      <td>
        Outputs the value of the given formula in a formatted list of results
      </td>
      <td style="white-space:nowrap">
        formula: string
        <br />data: object
      </td>
      <td style="white-space:nowrap">
        <code>@list.formula(formula "{x} + {this} + {y}" data { x 3 y 4 })</code>
      </td>
    </tr>
    <tr>
      <td><code>@list.html(attributes?)</code></td>
      <td>
        Uses a raw HTML format to represent this 
        column in a formatted list of results
      </td>
      <td style="white-space:nowrap">
        ordered: boolean
        <br />indent: number
        <br />spacing: number
      </td>
      <td style="white-space:nowrap">
        <code>@list.html</code>
        <br /><code>@list.html({ ordered true indent 10 spacing 10 })</code>
      </td>
    </tr>
    <tr>
      <td><code>@list.image</code></td>
      <td>
        Uses a image format to represent this column 
        in a formatted list of results
      </td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@list.imagelist</code></td>
      <td>
        Uses an image carousel to represent this column in a 
        formatted list of results. Ideally for an array of strings.
      </td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@list.json</code></td>
      <td>
        Uses a json format to represent this column in a formatted 
        list of results. Ideally for arrays or objects.
      </td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@list.link</code></td>
      <td>
        Uses a clickable link to represent this column 
        in a formatted list of results
      </td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@list.list</code></td>
      <td>
        Uses a list (ordered or unordered) to represent this 
        column in a formatted list of results. Ideally for an 
        array of strings
      </td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@list.markdown</code></td>
      <td>
        Converts the column value from markdown to raw HTML 
        to represent this column in a formatted list of results
      </td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@list.metadata(attributes?)</code></td>
      <td>
        Outputs the keys and values of the columns value in 
        tabular format. Ideally for a key value object.
      </td>
      <td style="white-space:nowrap">
        padding: number
        <br />align: left|right|center
        <br />format: boolean
      </td>
      <td style="white-space:nowrap">
        <code>@list.metadata</code>
        <br /><code>@list.metadata({ padding 10 align "left" format true })</code>
      </td>
    </tr>
    <tr>
      <td><code>@list.number(attributes?)</code></td>
      <td>
        Uses a number format to represent this column in 
        a formatted list of results
      </td>
      <td style="white-space:nowrap">
        separator: string
        <br />decimal: string
        <br />decimals: number
        <br />absolute: boolean
      </td>
      <td style="white-space:nowrap">
        <code>@list.number</code>
        <br /><code>@list.number({ separator "," decimal "." decimals 4 absolute true })</code>
      </td>
    </tr>
    <tr>
      <td><code>@list.overflow(attributes?)</code></td>
      <td>
        Uses a format that considers text overflows to represent 
        this column in a formatted list of results
      </td>
      <td style="white-space:nowrap">
        length: number
        <br />words: boolean
        <br />hellip: boolean
      </td>
      <td style="white-space:nowrap">
        <code>@list.overflow</code>
        <br /><code>@list.overflow({ length 10 words true hellip true})</code>
      </td>
    </tr>
    <tr>
      <td><code>@list.phone(attributes?)</code></td>
      <td>
        Uses a phone format to represent this column in a 
        formatted list of results
      </td>
      <td style="white-space:nowrap">label: string</td>
      <td style="white-space:nowrap">
        <code>@list.phone</code>
        <br /><code>@list.phone({ label "Call Me Maybe" })</code>
      </td>
    </tr>
    <tr>
      <td><code>@list.rating(attributes?)</code></td>
      <td>
        Uses a rating format to represent this column 
        in a formatted list of results
      </td>
      <td style="white-space:nowrap">
        max: number
        <br />remainder: boolean
        <br />round: round|ceil|floor
        <br />spacing: number
      </td>
      <td style="white-space:nowrap">
        <code>@list.rating</code>
        <br /><code>@list.rating({ max 5 remainder true round "floor" spacing 10 })</code>
      </td>
    </tr>
    <tr>
      <td><code>@list.separated(attributes?)</code></td>
      <td>
        Uses a separator format to represent this column in a 
        formatted list of results. Ideally for an array of strings.
      </td>
      <td style="white-space:nowrap">separator: string</td>
      <td style="white-space:nowrap">
        <code>@list.separated</code>
        <br /><code>@list.separated({ separator ", " })</code>
      </td>
    </tr>
    <tr>
      <td><code>@list.table(attributes?)</code></td>
      <td>
        Uses a tablular format to represent this column in a formatted 
        list of results. Ideally for an array of objects.
      </td>
      <td style="white-space:nowrap">
        top: boolean
        <br />left: boolean
        <br />right: boolean
        <br />padding: number
        <br />align: left|right|center
        <br />background: color
        <br />border: color
        <br />header: color
        <br />stripe: color
      </td>
      <td style="white-space:nowrap">
        <code>@list.table</code>
        <br /><code>@list.table({ align "left" top true padding 100 background "blue" header "#CCC" })</code>
      </td>
    </tr>
    <tr>
      <td><code>@list.taglist(attributes?)</code></td>
      <td>
        Uses a tag list format to represent this column in a formatted 
        list of results. Ideally for an array of strings.
      </td>
      <td style="white-space:nowrap">
        curved: boolean
        <br />rounded: boolean
        <br />pill: boolean
        <br />info: boolean
        <br />warning: boolean
        <br />success: boolean
        <br />error: boolean
        <br />muted: boolean
        <br />primary: boolean
        <br />color: color
        <br />secondary: boolean
        <br />outline: boolean
        <br />solid: boolean
        <br />transparent: boolean
      </td>
      <td style="white-space:nowrap">
        <code>@list.taglist</code>
        <br /><code>@list.taglist({ curved true info true outline true })</code>
      </td>
    </tr>
    <tr>
      <td><code>@list.template(attributes)</code></td>
      <td>
        Uses a template to generate a text to represent 
        this column in a formatted list of results
      </td>
      <td style="white-space:nowrap">template: string</td>
      <td style="white-space:nowrap"><code>@list.template({ template "{{foo}} and {{bar}}" })</code></td>
    </tr>
    <tr>
      <td><code>@list.text(attributes?)</code></td>
      <td>
        Uses a text format to represent this column in 
        a formatted list of results
      </td>
      <td style="white-space:nowrap">
        upper: boolean
        <br />lower: boolean
        <br />capital: boolean
      </td>
      <td style="white-space:nowrap">
        <code>@list.text</code>
        <br /><code>@list.text({ upper true })</code>
      </td>
    </tr>
    <tr>
      <td><code>@list.yesno(attributes?)</code></td>
      <td style="white-space:nowrap">
        Converts a boolean to a string representation to 
        represent this column in a formatted list of results
      </td>
      <td>yes: string<br />no: string</td>
      <td style="white-space:nowrap">
        <code>@list.yesno</code>
        <br /><code>@list.yesno({ yes "Yep" no "Nah" })</code>
      </td>
    </tr>
  </tbody>
</table>

## View Spec

The following view format fields can be applied to model columns in an idea file.

```js
created Datetime @view.date({ locale "en" })
```

<table cellspacing="0" cellpadding="0" border="1">
  <thead>
    <tr>
      <th align="left">Attribute</th>
      <th align="left">Description</th>
      <th align="left">Attributes</th>
      <th align="left">Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>@view.hide</code></td>
      <td>Hides this column in a view</td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@view.code(attributes?)</code></td>
      <td>Uses a code format to represent this column in a view</td>
      <td style="white-space:nowrap">
        lang: string
        <br />numbers: boolean 
        <br />inline: boolean
        <br />trim: boolean
        <br />ltrim: boolean
        <br />rtrim: boolean
      </td>
      <td style="white-space:nowrap">
        <code>@view.code</code>
        <br /><code>@view.code(lang "en" trim true)</code>
      </td>
    </tr>
    <tr>
      <td><code>@view.color(attributes?)</code></td>
      <td>Uses a code color to represent this column in a view</td>
      <td style="white-space:nowrap">box: boolean<br />text: boolean</td>
      <td style="white-space:nowrap">
        <code>@view.color</code>
        <br /><code>@view.color(box true text true)</code>
      </td>
    </tr>
    <tr>
      <td><code>@view.country(attributes?)</code></td>
      <td>Uses a country format to represent this column in a view</td>
      <td style="white-space:nowrap">flag: boolean<br />text: boolean</td>
      <td style="white-space:nowrap">
        <code>@view.country</code>
        <br /><code>@view.country(flag true text true)</code>
      </td>
    </tr>
    <tr>
      <td><code>@view.currency(attributes?)</code></td>
      <td>Uses a currency format to represent this column in a view</td>
      <td style="white-space:nowrap">flag: boolean<br />text: boolean</td>
      <td style="white-space:nowrap">
        <code>@view.currency</code>
        <br /><code>@view.currency(flag true text true)</code>
      </td>
    </tr>
    <tr>
      <td><code>@view.date(attributes?)</code></td>
      <td>Uses a date format to represent this column in a view</td>
      <td style="white-space:nowrap">locale: string<br />format: string</td>
      <td style="white-space:nowrap">
        <code>@view.date</code>
        <br /><code>@view.date(locale "en" format "MMMM D, YYYY, h:mm:ss a")</code>
      </td>
    </tr>
    <tr>
      <td><code>@view.email</code></td>
      <td>Uses an email format to represent this column in a view</td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@view.formula(attributes?)</code></td>
      <td>Outputs the value of the given formula in a view</td>
      <td style="white-space:nowrap">formula: string</td>
      <td style="white-space:nowrap"><code>@view.formula(formula "{x} + {this} + {y}" data { x 3 y 4 })</code></td>
    </tr>
    <tr>
      <td><code>@view.html(attributes?)</code></td>
      <td>Uses a raw HTML format to represent this column in a view</td>
      <td style="white-space:nowrap">
        ordered: boolean
        <br />indent: number
        <br />spacing: number
      </td>
      <td style="white-space:nowrap">
        <code>@view.html</code>
        <br /><code>@view.html({ ordered true indent 10 spacing 10 })</code>
      </td>
    </tr>
    <tr>
      <td><code>@view.image</code></td>
      <td>Uses a image format to represent this column in a view</td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@view.imagelist</code></td>
      <td>
        Uses an image carousel to represent this column in 
        a view. Ideally for an array of strings.
      </td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@view.json</code></td>
      <td>
        Uses a json format to represent this column in a view. 
        Ideally for arrays or objects.
      </td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@view.link</code></td>
      <td>Uses a clickable link to represent this column in a view</td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@view.list</code></td>
      <td>
        Uses a list (ordered or unordered) to represent this 
        column in a view. Ideally for an array of strings
      </td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@view.markdown</code></td>
      <td>
        Converts the column value from markdown to raw HTML 
        to represent this column in a view
      </td>
      <td style="white-space:nowrap">&nbsp;</td>
      <td style="white-space:nowrap">&nbsp;</td>
    </tr>
    <tr>
      <td><code>@view.metadata(attributes?)</code></td>
      <td>
        Outputs the keys and values of the columns value 
        in tabular format. Ideally for a key value object.
      </td>
      <td style="white-space:nowrap">
        padding: number
        <br />align: left|right|center
        <br />format: boolean
      </td>
      <td style="white-space:nowrap">
        <code>@view.metadata</code>
        <br /><code>@view.metadata({ padding 10 align "left" format true })</code>
      </td>
    </tr>
    <tr>
      <td><code>@view.number(attributes?)</code></td>
      <td>Uses a number format to represent this column in a view</td>
      <td style="white-space:nowrap">
        separator: string
        <br />decimal: string
        <br />decimals: boolean
        <br />absolute: boolean
      </td>
      <td style="white-space:nowrap">
        <code>@view.number</code>
        <br /><code>@view.number({ separator "," decimal "." decimals 4 absolute true })</code>
      </td>
    </tr>
    <tr>
      <td><code>@view.overflow(attributes?)</code></td>
      <td>
        Uses a format that considers text overflows to represent 
        this column in a view
      </td>
      <td style="white-space:nowrap">
        length: number
        <br />words: boolean
        <br />hellip: boolean
      </td>
      <td style="white-space:nowrap">
        <code>@view.overflow</code>
        <br /><code>@view.overflow({ length 10 words true hellip true})</code>
      </td>
    </tr>
    <tr>
      <td><code>@view.phone(attributes?)</code></td>
      <td>Uses a phone format to represent this column in a view</td>
      <td style="white-space:nowrap">label: string</td>
      <td style="white-space:nowrap">
        <code>@view.phone</code>
        <br /><code>@view.phone({ label "Call Me Maybe" })</code>
      </td>
    </tr>
    <tr>
      <td><code>@view.rating(attributes?)</code></td>
      <td>Uses a rating format to represent this column in a view</td>
      <td style="white-space:nowrap">
        max: number
        <br />remainder: boolean
        <br />round: round|ceil|floor
        <br />spacing: number
      </td>
      <td style="white-space:nowrap">
        <code>@view.rating</code>
        <br /><code>@view.rating({ max 5 remainder true round "floor" spacing 10 })</code>
      </td>
    </tr>
    <tr>
      <td><code>@view.separated(attributes?)</code></td>
      <td>
        Uses a separator format to represent this column in a 
        view. Ideally for an array of strings.
      </td>
      <td style="white-space:nowrap">separator: string</td>
      <td style="white-space:nowrap">
        <code>@view.separated</code>
        <br /><code>@view.separated({ separator ", " })</code>
      </td>
    </tr>
    <tr>
      <td><code>@view.table(attributes?)</code></td>
      <td>
        Uses a tablular format to represent this column 
        in a view. Ideally for an array of objects.
      </td>
      <td style="white-space:nowrap">
        top: boolean
        <br />left: boolean
        <br />right: boolean
        <br />padding: number
        <br />align: left|right|center
        <br />background: color
        <br />border: color
        <br />header: color
        <br />stripe: color
      </td>
      <td style="white-space:nowrap">
        <code>@view.table</code>
        <br /><code>@view.table({ align "left" top true padding 100 background "blue" header "#CCC" })</code>
      </td>
    </tr>
    <tr>
      <td><code>@view.taglist(attributes?)</code></td>
      <td>
        Uses a tag list format to represent this column in 
        a view. Ideally for an array of strings.
      </td>
      <td style="white-space:nowrap">
        curved: boolean
        <br />rounded: boolean
        <br />pill: boolean
        <br />info: boolean
        <br />warning: boolean
        <br />success: boolean
        <br />error: boolean
        <br />muted: boolean
        <br />primary: boolean
        <br />color: boolean
        <br />secondary: boolean
        <br />outline: boolean
        <br />solid: boolean
        <br />transparent: boolean
      </td>
      <td style="white-space:nowrap">
        <code>@view.taglist</code>
        <br /><code>@view.taglist({ curved true info true outline true })</code>
      </td>
    </tr>
    <tr>
      <td><code>@view.template(attributes?)</code></td>
      <td>Uses a template to generate a text to represent this column in a view</td>
      <td style="white-space:nowrap">template: string</td>
      <td style="white-space:nowrap"><code>@view.template({ template "{{foo}} and {{bar}}" })</code></td>
    </tr>
    <tr>
      <td><code>@view.text(attributes?)</code></td>
      <td>Uses a text format to represent this column in a view</td>
      <td style="white-space:nowrap">
        upper: boolean
        <br />lower: boolean
        <br />capital: boolean
      </td>
      <td style="white-space:nowrap">
        <code>@view.text</code>
        <br /><code>@view.text({ upper true })</code>
      </td>
    </tr>
    <tr>
      <td><code>@view.yesno(attributes?)</code></td>
      <td>
        Converts a boolean to a string representation to 
        represent this column in a view
      </td>
      <td style="white-space:nowrap">yes: string<br />no: string</td>
      <td style="white-space:nowrap">
        <code>@view.yesno</code>
        <br /><code>@view.yesno({ yes "Yep" no "Nah" })</code>
      </td>
    </tr>
  </tbody>
</table>
