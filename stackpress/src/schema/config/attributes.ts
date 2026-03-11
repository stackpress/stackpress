//stackpress/schema
import type { 
  AttributeDataMap,
  AttributeDataComponent,
  AttributeDataAssertion
} from '../types.js';

/**
 * Maps the values of an object using a mapper function
 */
export function mapObjectValue<T, U>(
  object: Record<string, T>, 
  mapper: (value: T, key: string) => U
) {
  return Object.fromEntries(
    Object.entries(object).map(([ key, value ]) => {
      return [ key, mapper(value, key) ];
    })
  );
};

//--------------------------------------------------------------------//
// Builtin Schema Attribute Definitions

const schema: AttributeDataMap = {
  "display": {
    "type": [ "method" ],
    "name": "display",
    "description": "A string version of each row in a model that can use row variables.",
    "args": [ 
      {
        "spread": false,
        "type": [ "string" ],
        "required": true,
        "description": "The template string.",
        "examples": [ "{{first_name}} {{last_name}}" ]
      } 
    ],
    "data": {}
  },
  "icon": {
    "type": [ "method" ],
    "name": "icon",
    "description": "An icon representation of a model. Uses font awesome names.",
    "args": [ 
      {
        "spread": false,
        "type": [ "string" ],
        "required": true,
        "description": "The name of the icon",
        "examples": [ "user", "cog", "database" ]
      } 
    ],
    "data": {}
  },
  "labels": {
    "type": [ "method" ],
    "name": "labels",
    "description": "The display labels for a model field (singular, plural).",
    "args": [ 
      {
        "spread": false,
        "type": [ "string" ],
        "required": true,
        "description": "The singular label.",
        "examples": [ "User", "Setting", "Database" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "required": true,
        "description": "The plural label.",
        "examples": [ "Users", "Settings", "Databases" ]
      }
    ],
    "data": {}
  },
  "query": {
    "type": [ "method" ],
    "name": "query",
    "description": "Default query columns to return when fetching rows from the model.",
    "args": [ 
      {
        "spread": true,
        "type": [ "string" ],
        "required": true,
        "description": "The template string.",
        "examples": [ "*", "user.*", "article.comment.*" ]
      } 
    ],
    "data": {}
  }
};

//--------------------------------------------------------------------//
// Builtin Column Attribute Definitions

const column: AttributeDataMap = {
  "active": {
    "type": [ "flag" ],
    "name": "active",
    "description": "A flag that represents the active field. Active fields are changed when deleting or restoring a row, as an alternative to actually deleting the row in the database.",
    "args": [],
    "data": {}
  },
  "default": {
    "type": [ "method" ],
    "name": "default",
    "description": "The default value applied when creating a row if no value was provided.",
    "args": [
      {
        "spread": false,
        "type": [ "string", "number", "boolean" ],
        "required": true,
        "description": "The default value.",
        "examples": [ "default text", 42, true ]
      }
    ],
    "data": {}
  },
  "description": {
    "type": [ "method" ],
    "name": "description",
    "description": "The internal description of the column for documentation purposes.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "required": true,
        "description": "The description value.",
        "examples": [ "This column represents the user's first name." ]
      }
    ],
    "data": {}
  },
  "examples": {
    "type": [ "method" ],
    "name": "examples",
    "description": "The internal example of the column for documentation purposes.",
    "args": [
      {
        "spread": true,
        "type": [ "string", "number", "boolean", "array", "object" ],
        "required": true,
        "description": "The example value.",
        "examples": [ "example 1", 42, true ]
      }
    ],
    "data": {}
  },
  "encrypted": {
    "type": [ "flag" ],
    "name": "encrypted",
    "description": "A flag to determine if the column should be encrypted (reversible).",
    "args": [],
    "data": {}
  },
  "generated": {
    "type": [ "flag" ],
    "name": "generated",
    "description": "A flag that represents that the value of this column is generated, bypassing the need to be validated",
    "args": [],
    "data": {}
  },
  "hashed": {
    "type": [ "flag" ],
    "name": "hashed",
    "description": "A flag to determine if the column should be hashed (one-way).",
    "args": [],
    "data": {}
  },
  "id": {
    "type": [ "flag" ],
    "name": "id",
    "description": "A flag that represents the models identifier. If multiple ids then the combination will be used to determine each rows uniqueness.",
    "args": [],
    "data": {}
  },
  "searchable": {
    "type": [ "flag" ],
    "name": "searchable",
    "description": "A flag deonoting this column is searchable and will be considered in a search field for example. Also used to know which columns need to be optimized in the database.",
    "args": [],
    "data": {}
  },
  "sortable": {
    "type": [ "flag" ],
    "name": "sortable",
    "description": "A flag deonoting this column is sortable. Also used to know which columns need to be optimized in the database.",
    "args": [],
    "data": {}
  },
  "label": {
    "type": [ "method" ],
    "name": "label",
    "description": "A label that will be shown to represent this column instead of the actual column name.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "required": true,
        "description": "The label string.",
        "examples": [ "First Name", "Created At", "Is Active" ]
      }
    ],
    "data": {}
  },
  "min": {
    "type": [ "method" ],
    "name": "min",
    "description": "The minimum number value that will be accepted. This is also a consideration when determining the database type.",
    "args": [
      {
        "spread": false,
        "type": [ "number" ],
        "required": true,
        "description": "A number value representing the minimum accepted value.",
        "examples": [ 0, -1, 10.5 ]
      }
    ],
    "data": {}
  },
  "max": {
    "type": [ "method" ],
    "name": "max",
    "description": "The maximum number value that will be accepted. This is also a consideration when determining the database type.",
    "args": [
      {
        "spread": false,
        "type": [ "number" ],
        "required": true,
        "description": "A number value representing the maximum accepted value.",
        "examples": [ 1, 10.5 ]
      }
    ],
    "data": {}
  },
  "step": {
    "type": [ "method" ],
    "name": "step",
    "description": "The incremental amount value that will be used when changing the columns value. This is also a consideration when determining the database type.",
    "args": [
      {
        "spread": false,
        "type": [ "number" ],
        "required": true,
        "description": "A number value representing the incremental step value.",
        "examples": [ 1, 10.5 ]
      }
    ],
    "data": {}
  },
  "relation": {
    "type": [ "method" ],
    "name": "relation",
    "description": "Maps columns in the model that is related to another model.",
    "args": [
      {
        "spread": false,
        "type": [
          {
            "local": "string",
            "foreign": "string",
            "name": "string"
          }
        ],
        "required": true,
        "description": "An object representing the relation mapping. 'local' is the local column name, 'foreign' is the foreign column name, and 'name' (optional) is the related model name.",
        "examples": [
          { "local": "userId", "foreign": "id" },
          { "name": "memberships", "local": "ownerId", "foreign": "id" },
          { "name": "connections", "local": "memberId", "foreign": "id" }
        ]
      }
    ],
    "data": {}
  },
  "timestamp": {
    "type": [ "flag" ],
    "name": "timestamp",
    "description": "A flag that will automatically update the timestamp whenever a row is changed.",
    "args": [],
    "data": {}
  },
  "unique": {
    "type": [ "flag" ],
    "name": "unique",
    "description": "A flag that ensures no duplicate value can be added to the model for this column.",
    "args": [],
    "data": {}
  }
};

//--------------------------------------------------------------------//
// Builtin Assertion Attribute Definitions

const assert: AttributeDataMap<AttributeDataAssertion> = {
  "required": {
    "type": [ "flag", "method" ],
    "name": "is.required",
    "description": "Validates that a value must be given before being inserted.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "First name is required." ]
      }
    ],
    "data": {
      "name": "required",
      "message": "Value is required."
    }
  },
  "ne": {
    "type": [ "flag", "method" ],
    "name": "is.ne",
    "description": "Validates that a value is something as opposed to an empty string.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "First name must not be empty." ]
      }
    ],
    "data": {
      "name": "ne",
      "message": "Must not be empty."
    }
  },
  "unique": {
    "type": [ "flag", "method" ],
    "name": "is.unique",
    "description": "Validates that a value is unique.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "First name must be unique." ]
      }
    ],
    "data": {
      "name": "unique",
      "message": "Already exists."
    }
  },
  "eq": {
    "type": [ "method" ],
    "name": "is.eq",
    "description": "Validates that a value must be given before being inserted.",
    "args": [
      {
        "spread": false,
        "type": [ "string", "number", "boolean" ],
        "required": true,
        "description": "The value to compare against.",
        "examples": [ "admin", 42 ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must be equal to admin." ]
      }
    ],
    "data": {
      "name": "eq",
      "message": "Must be equal to {{arg}}."
    }
  },
  "neq": {
    "type": [ "method" ],
    "name": "is.neq",
    "description": "Validates that the value is explicitly equal to the given argument",
    "args": [
      {
        "spread": false,
        "type": [ "string", "number" ],
        "required": true,
        "description": "The value to compare against.",
        "examples": [ "admin", 42 ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must not be equal to admin." ]
      }
    ],
    "data": {
      "name": "neq",
      "message": "Must not be equal to {{arg}}."
    }
  },
  "option": {
    "type": [ "method" ],
    "name": "is.option",
    "description": "Validates that the value is one of the given options",
    "args": [
      {
        "spread": false,
        "type": [ "string[]", "number[]" ],
        "required": true,
        "description": "The value to compare against.",
        "examples": [ "admin", 42 ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must be one of the given options." ]
      }
    ],
    "data": {
      "name": "option",
      "message": "Must be a valid option."
    }
  },
  "regex": {
    "type": [ "method" ],
    "name": "is.regex",
    "description": "Validates that the value matches the given regular expression",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "required": true,
        "description": "The value to compare against.",
        "examples": [ "^[a-zA-Z0-9]+$" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must match the given regular expression." ]
      }
    ],
    "data": {
      "name": "regex",
      "message": "Invalid format."
    }
  },
  "date": {
    "type": [ "flag", "method" ],
    "name": "is.date",
    "description": "Validates that the value is a date.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must be a valid date." ]
      }
    ],
    "data": {
      "name": "date",
      "message": "Must be a valid date."
    }
  },
  "future": {
    "type": [ "flag", "method" ],
    "name": "is.future",
    "description": "Validates that the value is a future date.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must be a future date." ]
      }
    ],
    "data": {
      "name": "future",
      "message": "Must be a future date."
    }
  },
  "past": {
    "type": [ "flag", "method" ],
    "name": "is.past",
    "description": "Validates that the value is a past date.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must be a past date." ]
      }
    ],
    "data": {
      "name": "past",
      "message": "Must be a past date."
    }
  },
  "present": {
    "type": [ "flag", "method" ],
    "name": "is.present",
    "description": "Validates that the value is a present date.",
    "args": [
      {
        "spread": false,
        "type": [ "null" ],
        "required": false,
        "description": "Buffer in seconds to consider as present.",
        "examples": [ "Value must be the present date." ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must be the present date." ]
      }
    ],
    "data": {
      "name": "present",
      "message": "Must be within the present date."
    }
  },
  "gt": {
    "type": [ "method" ],
    "name": "is.gt",
    "description": "Validates that the value is greater than the given argument",
    "args": [
      {
        "spread": false,
        "type": [ "number" ],
        "required": true,
        "description": "The value to compare against.",
        "examples": [ 1, 2.1, -3 ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must be greater than the given argument." ]
      }
    ],
    "data": {
      "name": "gt",
      "message": "Must be greater than {{arg}}."
    }
  },
  "ge": {
    "type": [ "method" ],
    "name": "is.ge",
    "description": "Validates that the value is greater than or equal to the given argument",
    "args": [
      {
        "spread": false,
        "type": [ "number" ],
        "required": true,
        "description": "The value to compare against.",
        "examples": [ 1, 2.1, -3 ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must be greater than or equal to the given argument." ]
      }
    ],
    "data": {
      "name": "ge",
      "message": "Must be greater than or equal to {{arg}}."
    }
  },
  "lt": {
    "type": [ "method" ],
    "name": "is.lt",
    "description": "Validates that the value is less than the given argument",
    "args": [
      {
        "spread": false,
        "type": [ "number" ],
        "required": true,
        "description": "The value to compare against.",
        "examples": [ 1, 2.1, -3 ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must be less than the given argument." ]
      }
    ],
    "data": {
      "name": "lt",
      "message": "Must be less than {{arg}}."
    }
  },
  "le": {
    "type": [ "method" ],
    "name": "is.le",
    "description": "Validates that the value is less than or equal to the given argument",
    "args": [
      {
        "spread": false,
        "type": [ "number" ],
        "required": true,
        "description": "The value to compare against.",
        "examples": [ 1, 2.1, -3 ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must be less than or equal to the given argument." ]
      }
    ],
    "data": {
      "name": "le",
      "message": "Must be less than or equal to {{arg}}."
    }
  },
  "ceq": {
    "type": [ "method" ],
    "name": "is.ceq",
    "description": "Validate that the character count of the value is equal to the given number",
    "args": [
      {
        "spread": false,
        "type": [ "number" ],
        "required": true,
        "description": "The value to compare against.",
        "examples": [ 1, 10, 50 ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must have a character count equal to the given number." ]
      }
    ],
    "data": {
      "name": "ceq",
      "message": "Must be {{arg}} characters."
    }
  },
  "cgt": {
    "type": [ "method" ],
    "name": "is.cgt",
    "description": "Validates that the character count of the value is greater than the given argument",
    "args": [
      {
        "spread": false,
        "type": [ "number" ],
        "required": true,
        "description": "The value to compare against.",
        "examples": [ 1, 10, 50 ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must have a character count greater than the given argument." ]
      }
    ],
    "data": {
      "name": "cgt",
      "message": "Must be greater than {{arg}} characters."
    }
  },
  "cge": {
    "type": [ "method" ],
    "name": "is.cge",
    "description": "Validates that the character count of the value is greater than or equal to the given argument",
    "args": [
      {
        "spread": false,
        "type": [ "number" ],
        "required": true,
        "description": "The value to compare against.",
        "examples": [ 1, 10, 50 ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must have a character count greater than or equal to the given argument." ]
      }
    ],
    "data": {
      "name": "cge",
      "message": "Must be greater than or equal to {{arg}} characters."
    }
  },
  "clt": {
    "type": [ "method" ],
    "name": "is.clt",
    "description": "Validates that the character count of the value is less than the given argument",
    "args": [
      {
        "spread": false,
        "type": [ "number" ],
        "required": true,
        "description": "The value to compare against.",
        "examples": [ 1, 10, 50 ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must have a character count less than the given argument." ]
      }
    ],
    "data": {
      "name": "clt",
      "message": "Must be less than {{arg}} characters."
    }
  },
  "cle": {
    "type": [ "method" ],
    "name": "is.cle",
    "description": "Validates that the character count of the value is less than or equal to the given argument",
    "args": [
      {
        "spread": false,
        "type": [ "number" ],
        "required": true,
        "description": "The value to compare against.",
        "examples": [ 1, 10, 50 ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must have a character count less than or equal to the given argument." ]
      }
    ],
    "data": {
      "name": "cle",
      "message": "Must be less than or equal to {{arg}} characters."
    }
  },
  "weq": {
    "type": [ "method" ],
    "name": "is.weq",
    "description": "Validate that the word count of the value is equal to the given number",
    "args": [
      {
        "spread": false,
        "type": [ "number" ],
        "required": true,
        "description": "The value to compare against.",
        "examples": [ 1, 10, 50 ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must have a word count equal to the given number." ]
      }
    ],
    "data": {
      "name": "weq",
      "message": "Must be {{arg}} words."
    }
  },
  "wgt": {
    "type": [ "method" ],
    "name": "is.wgt",
    "description": "Validates that the word count of the value is greater than the given argument",
    "args": [
      {
        "spread": false,
        "type": [ "number" ],
        "required": true,
        "description": "The value to compare against.",
        "examples": [ 1, 10, 50 ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must have a word count greater than the given argument." ]
      }
    ],
    "data": {
      "name": "wgt",
      "message": "Must be greater than {{arg}} words."
    }
  },
  "wge": {
    "type": [ "method" ],
    "name": "is.wge",
    "description": "Validates that the word count of the value is greater than or equal to the given argument",
    "args": [
      {
        "spread": false,
        "type": [ "number" ],
        "required": true,
        "description": "The value to compare against.",
        "examples": [ 1, 10, 50 ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must have a word count greater than or equal to the given argument." ]
      }
    ],
    "data": {
      "name": "wge",
      "message": "Must be greater than or equal to {{arg}} words."
    }
  },
  "wlt": {
    "type": [ "method" ],
    "name": "is.wlt",
    "description": "Validates that the word count of the value is less than the given argument",
    "args": [
      {
        "spread": false,
        "type": [ "number" ],
        "required": true,
        "description": "The value to compare against.",
        "examples": [ 1, 10, 50 ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must have a word count less than the given argument." ]
      }
    ],
    "data": {
      "name": "wlt",
      "message": "Must be less than {{arg}} words."
    }
  },
  "wle": {
    "type": [ "method" ],
    "name": "is.wle",
    "description": "Validates that the word count of the value is less than or equal to the given argument",
    "args": [
      {
        "spread": false,
        "type": [ "number" ],
        "required": true,
        "description": "The value to compare against.",
        "examples": [ 1, 10, 50 ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must have a word count less than or equal to the given argument." ]
      }
    ],
    "data": {
      "name": "wle",
      "message": "Must be less than or equal to {{arg}} words."
    }
  },
  "cc": {
    "type": [ "flag", "method" ],
    "name": "is.cc",
    "description": "Validates that the value is a credit card.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must be a valid credit card number." ]
      }
    ],
    "data": {
      "name": "cc",
      "message": "Must be a valid credit card number."
    }
  },
  "color": {
    "type": [ "flag", "method" ],
    "name": "is.color",
    "description": "Validates that the value is a color value (color name or hex)",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must be a valid color value." ]
      }
    ],
    "data": {
      "name": "color",
      "message": "Must be a valid color format."
    }
  },
  "email": {
    "type": [ "flag", "method" ],
    "name": "is.email",
    "description": "Validates that the value is an email address.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must be a valid email address." ]
      }
    ],
    "data": {
      "name": "email",
      "message": "Must be a valid email address."
    }
  },
  "hex": {
    "type": [ "flag", "method" ],
    "name": "is.hex",
    "description": "Validates that the value is a hex.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must be a valid hex value." ]
      }
    ],
    "data": {
      "name": "hex",
      "message": "Must be a valid hex value."
    }
  },
  "price": {
    "type": [ "flag", "method" ],
    "name": "is.price",
    "description": "Validates that the value is a price format (ie. 2 decimal numbers).",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must be a valid price format." ]
      }
    ],
    "data": {
      "name": "price",
      "message": "Must be a valid price format."
    }
  },
  "url": {
    "type": [ "flag", "method" ],
    "name": "is.url",
    "description": "Validates that the value is a URL.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must be a valid URL." ]
      }
    ],
    "data": {
      "name": "url",
      "message": "Must be a valid URL."
    }
  },
  "string": {
    "type": [ "flag", "method" ],
    "name": "is.string",
    "description": "Validates that the value is a string.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must be a valid number." ]
      }
    ],
    "data": {
      "name": "string",
      "message": "Must be a string."
    }
  },
  "boolean": {
    "type": [ "flag", "method" ],
    "name": "is.boolean",
    "description": "Validates that the value is a boolean.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must be a valid boolean." ]
      }
    ],
    "data": {
      "name": "boolean",
      "message": "Must be a boolean."
    }
  },
  "number": {
    "type": [ "flag", "method" ],
    "name": "is.number",
    "description": "Validates that the value is a number.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must be a valid number." ]
      }
    ],
    "data": {
      "name": "number",
      "message": "Must be a number."
    }
  },
  "float": {
    "type": [ "flag", "method" ],
    "name": "is.float",
    "description": "Validates that the value is a float format.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must be a valid float format." ]
      }
    ],
    "data": {
      "name": "float",
      "message": "Must be a valid float number."
    }
  },
  "integer": {
    "type": [ "flag", "method" ],
    "name": "is.integer",
    "description": "Validates that the value is an integer format.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must be a valid integer format." ]
      }
    ],
    "data": {
      "name": "integer",
      "message": "Must be a valid integer format."
    }
  },
  "object": {
    "type": [ "flag", "method" ],
    "name": "is.object",
    "description": "Validates that the value is an object.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "required": false,
        "description": "Custom error message.",
        "examples": [ "Value must be a valid object." ]
      }
    ],
    "data": {
      "name": "object",
      "message": "Must be an object."
    }
  }
};

//--------------------------------------------------------------------//
// Builtin Field Attribute Definitions

const field: AttributeDataMap<AttributeDataComponent> = {
  "checkbox": {
    "type": [ "flag", "method" ],
    "name": "field.checkbox",
    "description": "Use a checkbox to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "blue",
        "required": false,
        "description": "Show blue checkbox",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "check",
        "required": false,
        "description": "Show check when checked",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "checked",
        "required": false,
        "description": "Default checked state (Controlled)",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "circle",
        "required": false,
        "description": "Show circle when checked",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-checkbox" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "defaultChecked",
        "required": false,
        "description": "Default checked state (Uncontrolled)",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "label",
        "required": false,
        "description": "Shows text to the right of checkbox",
        "examples": [ "Is Active" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "orange",
        "required": false,
        "description": "Show orange checkbox",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "rounded",
        "required": false,
        "description": "Make checkbox rounded",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "square",
        "required": false,
        "description": "Show square when checked",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "Checkbox",
      "import": {
        "from": "frui/form/Checkbox",
        "default": true
      },
      "attributes": {}
    }
  },
  "code": {
    "type": [ "flag", "method" ],
    "name": "field.code",
    "description": "Use a code editor to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-code-field" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "extensions",
        "required": false,
        "description": "Set of CodeMirror extensions that can be added",
        "examples": []
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "language",
        "required": false,
        "description": "Language to use",
        "examples": [ "javascript", "python", "css", "html", "json" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "numbers",
        "required": false,
        "description": "Toggle line numbers (defaults to false; ineffective when using basic setup).",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "setup",
        "required": false,
        "description": "CodeMirror setup options ('minimal' | 'basic' | 'custom')",
        "examples": [ "basic" ]
      }
    ],
    "data": {
      "name": "CodeEditor",
      "import": {
        "from": "frui/form/CodeEditor",
        "default": true
      },
      "attributes": {}
    }
  },
  "color": {
    "type": [ "flag", "method" ],
    "name": "field.color",
    "description": "Use a color field to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-color-field" ]
      },
      {
        "spread": false,
        "type": [ "string", "CSS Object" ],
        "name": "input",
        "required": false,
        "description": "Input slot styles",
        "examples": [ 
          "custom-input-class",
          { "width": "100px", "height": "30px" } 
        ]
      },
      {
        "spread": false,
        "type": [ "string", "CSS Object" ],
        "name": "picker",
        "required": false,
        "description": "Picker slot styles",
        "examples": [ "circle" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "ColorInput",
      "import": {
        "from": "frui/form/ColorInput",
        "default": true
      },
      "attributes": {}
    }
  },
  "country": {
    "type": [ "flag", "method" ],
    "name": "field.country",
    "description": "Use a country select to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-country-field" ]
      },
      {
        "spread": false,
        "type": [ "string", "CSS Object" ],
        "name": "display",
        "required": false,
        "description": "Style to apply to the select display",
        "examples": [ 
          "custom-display-class",
          { "padding": "5px 10px", "fontSize": "14px" } 
        ]
      },
      {
        "spread": false,
        "type": [ "string", "CSS Object" ],
        "name": "dropdown",
        "required": false,
        "description": "Style to apply to the select drop down",
        "examples": [ 
          "custom-dropdown-class",
          { "maxHeight": "200px", "overflowY": "auto" } 
        ]
      },
      {
        "spread": false,
        "type": [ "string", "CSS Object" ],
        "name": "option",
        "required": false,
        "description": "Style to apply to the select option",
        "examples": [ 
          "custom-option-class",
          { "padding": "5px 10px", "fontSize": "14px" } 
        ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "placeholder",
        "required": false,
        "description": "Placeholder text when no option is selected",
        "examples": [ "Select Country" ]
      },
      {
        "spread": false,
        "type": [ "string", "boolean" ],
        "name": "searchable",
        "required": false,
        "description": "Whether the country select is searchable",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard HTML styles",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "CountrySelect",
      "import": {
        "from": "frui/form/CountrySelect",
        "default": true
      },
      "attributes": {}
    }
  },
  "currency": {
    "type": [ "flag", "method" ],
    "name": "field.currency",
    "description": "Use a currency select to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-currency-field" ]
      },
      {
        "spread": false,
        "type": [ "string", "CSS Object" ],
        "name": "display",
        "required": false,
        "description": "Style to apply to the select display",
        "examples": [ 
          "custom-display-class",
          { "padding": "5px 10px", "fontSize": "14px" } 
        ]
      },
      {
        "spread": false,
        "type": [ "string", "CSS Object" ],
        "name": "dropdown",
        "required": false,
        "description": "Style to apply to the select drop down",
        "examples": [ 
          "custom-dropdown-class",
          { "maxHeight": "200px", "overflowY": "auto" } 
        ]
      },
      {
        "spread": false,
        "type": [ "string", "CSS Object" ],
        "name": "option",
        "required": false,
        "description": "Style to apply to the select option",
        "examples": [ 
          "custom-option-class",
          { "padding": "5px 10px", "fontSize": "14px" } 
        ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "placeholder",
        "required": false,
        "description": "Placeholder text when no option is selected",
        "examples": [ "Select Currency" ]
      },
      {
        "spread": false,
        "type": [ "string", "boolean" ],
        "name": "searchable",
        "required": false,
        "description": "Whether the currency select is searchable",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard HTML styles",
        "examples": [ { "marginTop": "10px" } ]
      } 
    ],
    "data": {
      "name": "CurrencySelect",
      "import": {
        "from": "frui/form/CurrencySelect",
        "default": true
      },
      "attributes": {}
    }
  },
  "date": {
    "type": [ "flag", "method" ],
    "name": "field.date",
    "description": "Use a date input to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-date-field" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "DateInput",
      "import": {
        "from": "frui/form/DateInput",
        "default": true
      },
      "attributes": {}
    }
  },
  "datelist": {
    "type": [ "flag", "method" ],
    "name": "field.datelist",
    "description": "Use a date list to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "add",
        "required": false,
        "description": "Add button text",
        "examples": [ "Add Item" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names applied to the add button",
        "examples": [ "my-text-list" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "placeholder",
        "required": false,
        "description": "Placeholders for input values.",
        "examples": [ "Enter text" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object applied to the add button",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "TextList",
      "import": {
        "from": "frui/form/TextList",
        "default": true
      },
      "attributes": {
        "type": "date"
      }
    }
  },
  "datetime": {
    "type": [ "flag", "method" ],
    "name": "field.datetime",
    "description": "Use a datetime input to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-datetime-field" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "DatetimeInput",
      "import": {
        "from": "frui/form/DatetimeInput",
        "default": true
      },
      "attributes": {}
    }
  },
  "datetimelist": {
    "type": [ "flag", "method" ],
    "name": "field.datetimelist",
    "description": "Use a datetime list to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "add",
        "required": false,
        "description": "Add button text",
        "examples": [ "Add Item" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names applied to the add button",
        "examples": [ "my-text-list" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "placeholder",
        "required": false,
        "description": "Placeholders for input values.",
        "examples": [ "Enter text" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object applied to the add button",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "TextList",
      "import": {
        "from": "frui/form/TextList",
        "default": true
      },
      "attributes": {
        "type": "datetime"
      }
    }
  },
  "email": {
    "type": [ "component"],
    "name": "field.email",
    "description": "Use an email input to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-email-field" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "Input",
      "import": {
        "from": "frui/form/Input",
        "default": true
      },
      "attributes": { "type": "email" }
    }
  },
  "file": {
    "type": [ "flag", "method" ],
    "name": "field.file",
    "description": "Use a file input to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-file-field" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "uploading",
        "required": false,
        "description": "Phrased used when uploading files",
        "examples": [ "Uploading..." ]
      }
    ],
    "data": {
      "name": "FileInput",
      "import": {
        "from": "frui/form/FileInput",
        "default": true
      },
      "attributes": {}
    }
  },
  "filelist": {
    "type": [ "flag", "method" ],
    "name": "field.filelist",
    "description": "Use a file list field to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-file-list-field" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "uploading",
        "required": false,
        "description": "Phrased used when uploading files",
        "examples": [ "Uploading..." ]
      }
    ],
    "data": {
      "name": "FileList",
      "import": {
        "from": "frui/form/FileList",
        "default": true
      },
      "attributes": {}
    }
  },
  "image": {
    "type": [ "flag", "method" ],
    "name": "field.image",
    "description": "Use an image input to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-image-field" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "ImageInput",
      "import": {
        "from": "frui/form/ImageInput",
        "default": true
      },
      "attributes": {}
    }
  },
  "imagelist": {
    "type": [ "flag", "method" ],
    "name": "field.imagelist",
    "description": "Use an image list field to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-image-list-field" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "ImageList",
      "import": {
        "from": "frui/form/ImageList",
        "default": true
      },
      "attributes": {}
    }
  },
  "input": {
    "type": [ "flag", "method" ],
    "name": "field.input",
    "description": "Use an input to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-input-field" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "placeholder",
        "required": false,
        "description": "Input placeholder text",
        "examples": [ "Enter text here" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "Input",
      "import": {
        "from": "frui/form/Input",
        "default": true
      },
      "attributes": {}
    }
  },
  "integer": {
    "type": [ "flag", "method" ],
    "name": "field.integer",
    "description": "Use an integer input to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "absolute",
        "required": false,
        "description": "Whether to only allow absolute (positive) numbers",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-number-field" ]
      },
      {
        "spread": false,
        "type": [ "string", "number" ],
        "name": "max",
        "required": false,
        "description": "Maximum value allowed",
        "examples": [ 100 ]
      },
      {
        "spread": false,
        "type": [ "string", "number" ],
        "name": "min",
        "required": false,
        "description": "Minimum value allowed",
        "examples": [ 0 ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "separator",
        "required": false,
        "description": "Character to use for thousands separator",
        "examples": [ "," ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "NumberInput",
      "import": {
        "from": "frui/form/NumberInput",
        "default": true
      },
      "attributes": { "step": 1 }
    }
  },
  "json": {
    "type": [ "flag", "method" ],
    "name": "field.json",
    "description": "Use a raw JSON editor to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-code-field" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "extensions",
        "required": false,
        "description": "Set of CodeMirror extensions that can be added",
        "examples": []
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "numbers",
        "required": false,
        "description": "Toggle line numbers (defaults to false; ineffective when using basic setup).",
        "examples": [ true ]
      }
    ],
    "data": {
      "name": "CodeEditor",
      "import": {
        "from": "frui/form/CodeEditor",
        "default": true
      },
      "attributes": {
        "language": "json",
        "setup": "basic"
      }
    }
  },
  "markdown": {
    "type": [ "flag", "method" ],
    "name": "field.markdown",
    "description": "Use a markdown editor to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-markdown-field" ]
      },
      {
        "spread": false,
        "type": [ "number" ],
        "name": "rows",
        "required": false,
        "description": "Number of visible rows",
        "examples": [ 10 ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "MarkdownEditor",
      "import": {
        "from": "frui/form/MarkdownEditor",
        "default": true
      },
      "attributes": {}
    }
  },
  "mask": {
    "type": [ "flag", "method" ],
    "name": "field.mask",
    "description": "Use a mask input to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-mask-field" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "mask",
        "required": true,
        "description": "Mask format to validate input",
        "examples": [ "(999) 999-9999", "AA-9999", "9999-AAAA" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "MaskInput",
      "import": {
        "from": "frui/form/MaskInput",
        "default": true
      },
      "attributes": {}
    }
  },
  "metadata": {
    "type": [ "flag", "method" ],
    "name": "field.metadata",
    "description": "Use a metadata field to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "add",
        "required": false,
        "description": "Add button text",
        "examples": [ "Add Metadata" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-metadata-field" ]
      },
      {
        "spread": false,
        "type": [ "string", "number" ],
        "name": "min",
        "required": false,
        "description": "Used to set minimum number if type is number",
        "examples": [ 1 ]
      },
      {
        "spread": false,
        "type": [ "string", "number" ],
        "name": "max",
        "required": false,
        "description": "Used to set maximum number if type is number",
        "examples": [ 10 ]
      },
      {
        "spread": false,
        "type": [ "string", "string[]" ],
        "name": "placeholder",
        "required": false,
        "description": "Placeholders for input values.",
        "examples": [ "Key", "Value" ]
      },
      {
        "spread": false,
        "type": [ "string", "number" ],
        "name": "step",
        "required": false,
        "description": "Used to set step number if type is number",
        "examples": [ 1 ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "type",
        "required": false,
        "description": "Sets the type of value input",
        "examples": [ "text", "number" ]
      }
    ],
    "data": {
      "name": "Metadata",
      "import": {
        "from": "frui/form/Metadata",
        "default": true
      },
      "attributes": {}
    }
  },
  "number": {
    "type": [ "flag", "method" ],
    "name": "field.number",
    "description": "Use a number input to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "absolute",
        "required": false,
        "description": "Whether to only allow absolute (positive) numbers",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-number-field" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "decimal",
        "required": false,
        "description": "Character to use for decimal point",
        "examples": [ "." ]
      },
      {
        "spread": false,
        "type": [ "string", "number" ],
        "name": "max",
        "required": false,
        "description": "Maximum value allowed",
        "examples": [ 100 ]
      },
      {
        "spread": false,
        "type": [ "string", "number" ],
        "name": "min",
        "required": false,
        "description": "Minimum value allowed",
        "examples": [ 0 ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "separator",
        "required": false,
        "description": "Character to use for thousands separator",
        "examples": [ "," ]
      },
      {
        "spread": false,
        "type": [ "string", "number" ],
        "name": "step",
        "required": false,
        "description": "Incremental step value",
        "examples": [ 0.01 ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "NumberInput",
      "import": {
        "from": "frui/form/NumberInput",
        "default": true
      },
      "attributes": {}
    }
  },
  "numberlist": {
    "type": [ "flag", "method" ],
    "name": "field.numberlist",
    "description": "Use a number list to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "add",
        "required": false,
        "description": "Add button text",
        "examples": [ "Add Item" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names applied to the add button",
        "examples": [ "my-text-list" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "placeholder",
        "required": false,
        "description": "Placeholders for input values.",
        "examples": [ "Enter text" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object applied to the add button",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "TextList",
      "import": {
        "from": "frui/form/TextList",
        "default": true
      },
      "attributes": {
        "type": "number"
      }
    }
  },
  "password": {
    "type": [ "flag", "method" ],
    "name": "field.password",
    "description": "Use a password input to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-password-field" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "PasswordInput",
      "import": {
        "from": "frui/form/PasswordInput",
        "default": true
      },
      "attributes": {}
    }
  },
  "phone": {
    "type": [ "flag", "method" ],
    "name": "field.phone",
    "description": "Use a phone input to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "bottom",
        "required": false,
        "description": "Position dropdown below the control",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-phone-field" ]
      },
      {
        "spread": false,
        "type": [ "string", "CSS Object" ],
        "name": "control",
        "required": false,
        "description": "Style to apply to the select control",
        "examples": [ 
          "custom-control-class",
          { "padding": "5px 10px", "fontSize": "14px" } 
        ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "defaultCountry",
        "required": false,
        "description": "Default country ISO2 code",
        "examples": [ "us", "gb", "ca" ]
      },
      {
        "spread": false,
        "type": [ "string", "CSS Object" ],
        "name": "dropdown",
        "required": false,
        "description": "Style to apply to the select drop down",
        "examples": [ 
          "custom-dropdown-class",
          { "maxHeight": "200px", "overflowY": "auto" } 
        ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "left",
        "required": false,
        "description": "Position dropdown to the left of the control",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "string", "CSS Object" ],
        "name": "option",
        "required": false,
        "description": "Style to apply to the select option",
        "examples": [ 
          "custom-option-class",
          { "padding": "5px 10px", "fontSize": "14px" } 
        ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "right",
        "required": false,
        "description": "Position dropdown to the right of the control",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "string", "boolean" ],
        "name": "searchable",
        "required": false,
        "description": "Whether the country dropdown should include a search filter (default: true).",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "top",
        "required": false,
        "description": "Position dropdown above the control",
        "examples": [ true ]
      }
    ],
    "data": {
      "name": "PhoneInput",
      "import": {
        "from": "frui/form/PhoneInput",
        "default": true
      },
      "attributes": {}
    }
  },
  "price": {
    "type": [ "flag", "method" ],
    "name": "field.price",
    "description": "Use a price input to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "absolute",
        "required": false,
        "description": "Whether to only allow absolute (positive) numbers",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-price-field" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "decimal",
        "required": false,
        "description": "Character to use for decimal point",
        "examples": [ "." ]
      },
      {
        "spread": false,
        "type": [ "string", "number" ],
        "name": "max",
        "required": false,
        "description": "Maximum value allowed",
        "examples": [ 100 ]
      },
      {
        "spread": false,
        "type": [ "string", "number" ],
        "name": "min",
        "required": false,
        "description": "Minimum value allowed",
        "examples": [ 0 ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "separator",
        "required": false,
        "description": "Character to use for thousands separator",
        "examples": [ "," ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "NumberInput",
      "import": {
        "from": "frui/form/NumberInput",
        "default": true
      },
      "attributes": { "step": 0.01 }
    }
  },
  "radio": {
    "type": [ "flag", "method" ],
    "name": "field.radio",
    "description": "Use a radio button to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "blue",
        "required": false,
        "description": "Show blue checkbox",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "check",
        "required": false,
        "description": "Show check when checked",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "checked",
        "required": false,
        "description": "Default checked state (Controlled)",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "circle",
        "required": false,
        "description": "Show circle when checked",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-radio-button" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "defaultChecked",
        "required": false,
        "description": "Default checked state (Uncontrolled)",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "label",
        "required": false,
        "description": "Shows text to the right of checkbox",
        "examples": [ "Option 1" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "orange",
        "required": false,
        "description": "Show orange checkbox",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "rounded",
        "required": false,
        "description": "Make checkbox rounded",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "square",
        "required": false,
        "description": "Show square when checked",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "Radio",
      "import": {
        "from": "frui/form/Radio",
        "default": true
      },
      "attributes": {}
    }
  },
  "rating": {
    "type": [ "flag", "method" ],
    "name": "field.rating",
    "description": "Use a rating field to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-rating-field" ]
      },
      {
        "spread": false,
        "type": [ "number" ],
        "name": "max",
        "required": false,
        "description": "The maximum rating value (number of icons).",
        "examples": [ 5 ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "size",
        "required": false,
        "description": "The size of the rating icons. ('small' | 'medium' | 'large')",
        "examples": [ "medium" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "Rating",
      "import": {
        "from": "frui/form/Rating",
        "default": true
      },
      "attributes": {}
    }
  },
  "select": {
    "type": [ "flag", "method" ],
    "name": "field.select",
    "description": "Use a select to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-select-field" ]
      },
      {
        "spread": false,
        "type": [ "string", "CSS Object" ],
        "name": "display",
        "required": false,
        "description": "Style to apply to the select display",
        "examples": [ 
          "custom-display-class",
          { "padding": "5px 10px", "fontSize": "14px" } 
        ]
      },
      {
        "spread": false,
        "type": [ "string", "CSS Object" ],
        "name": "dropdown",
        "required": false,
        "description": "Style to apply to the select drop down",
        "examples": [ 
          "custom-dropdown-class",
          { "maxHeight": "200px", "overflowY": "auto" } 
        ]
      },
      {
        "spread": false,
        "type": [ "string", "CSS Object" ],
        "name": "option",
        "required": false,
        "description": "Style to apply to the select option",
        "examples": [ 
          "custom-option-class",
          { "padding": "5px 10px", "fontSize": "14px" } 
        ]
      },
      {
        "spread": false,
        "type": [ "string[]" ],
        "name": "options",
        "required": false,
        "description": "Array of options for the select field",
        "examples": [ [ "Option 1", "Option 2", "Option 3" ] ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "placeholder",
        "required": false,
        "description": "Placeholder text when no option is selected",
        "examples": [ "Select an option" ]
      }
    ],
    "data": {
      "name": "Select",
      "import": {
        "from": "frui/form/Select",
        "default": true
      },
      "attributes": {}
    }
  },
  "slider": {
    "type": [ "flag", "method" ],
    "name": "field.slider",
    "description": "Use a slider to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "asc",
        "required": false,
        "description": "Ensures lower handle is always less than or equal to higher handle",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "bgblack",
        "required": false,
        "description": "Black background color (track color)",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "bgcolor",
        "required": false,
        "description": "Custom background color (track color)",
        "examples": [ "#000000" ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "bgerror",
        "required": false,
        "description": "Error background color (track color)",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "bginfo",
        "required": false,
        "description": "Info background color (track color)",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "bgmuted",
        "required": false,
        "description": "Muted background color (track color)",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "bgprimary",
        "required": false,
        "description": "Primary background color (track color)",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "bgsecondary",
        "required": false,
        "description": "Secondary background color (track color)",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "bgsuccess",
        "required": false,
        "description": "Success background color (track color)",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "bgtertiary",
        "required": false,
        "description": "Tertiary background color (track color)",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "bgwarning",
        "required": false,
        "description": "Warning background color (track color)",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "bgwhite",
        "required": false,
        "description": "White background color (track color)",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "black",
        "required": false,
        "description": "Black color (handle color)",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-slider-field" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "color",
        "required": false,
        "description": "Custom color (handle color)",
        "examples": [ "#ff0000" ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "connect",
        "required": false,
        "description": "Adds a connecting line between handles",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "desc",
        "required": false,
        "description": "Ensures lower handle is always more than or equal to higher handle",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "CSS Object", "string" ],
        "name": "handles",
        "required": false,
        "description": "Styles for handles",
        "examples": [ 
          "custom-handle-class",
          { "width": "20px", "height": "20px", "borderRadius": "50%" } 
        ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "info",
        "required": false,
        "description": "Info color (handle color)",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "CSS Object", "string" ],
        "name": "inputs",
        "required": false,
        "description": "Styles for inputs",
        "examples": [ 
          "custom-input-class",
          { "width": "50px", "marginLeft": "10px" } 
        ]
      },
      {
        "spread": false,
        "type": [ "string", "number" ],
        "name": "max",
        "required": false,
        "description": "Maximum value",
        "examples": [ 100 ]
      },
      {
        "spread": false,
        "type": [ "string", "number" ],
        "name": "min",
        "required": false,
        "description": "Minimum value",
        "examples": [ 0 ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "muted",
        "required": false,
        "description": "Muted color (handle color)",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "primary",
        "required": false,
        "description": "Primary color (handle color)",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "range",
        "required": false,
        "description": "Whether to use 1 or 2 handles",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "secondary",
        "required": false,
        "description": "Secondary color (handle color)",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "success",
        "required": false,
        "description": "Success color (handle color)",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "string", "number" ],
        "name": "step",
        "required": false,
        "description": "Increment step value",
        "examples": [ 1 ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "tertiary",
        "required": false,
        "description": "Tertiary color (handle color)",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "CSS Object", "string" ],
        "name": "track",
        "required": false,
        "description": "Styles for track",
        "examples": [ 
          "custom-track-class",
          { "height": "6px", "borderRadius": "3px" } 
        ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "warning",
        "required": false,
        "description": "Warning color (handle color)",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "white",
        "required": false,
        "description": "White color (handle color)",
        "examples": [ true ]
      }
    ],
    "data": {
      "name": "Slider",
      "import": {
        "from": "frui/form/Slider",
        "default": true
      },
      "attributes": {}
    }
  },
  "slug": {
    "type": [ "flag", "method" ],
    "name": "field.slug",
    "description": "Use a slug input to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-slug-field" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "SlugInput",
      "import": {
        "from": "frui/form/SlugInput",
        "default": true
      },
      "attributes": {}
    }
  },
  "small": {
    "type": [ "flag", "method" ],
    "name": "field.small",
    "description": "Use a small input to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-small-field" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "NumberInput",
      "import": {
        "from": "frui/form/NumberInput",
        "default": true
      },
      "attributes": { "max": 9, "min": 0, "step": 1 }
    }
  },
  "stringlist": {
    "type": [ "flag", "method" ],
    "name": "field.stringlist",
    "description": "Use a string list to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "add",
        "required": false,
        "description": "Add button text",
        "examples": [ "Add Item" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names applied to the add button",
        "examples": [ "my-text-list" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "placeholder",
        "required": false,
        "description": "Placeholders for input values.",
        "examples": [ "Enter text" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object applied to the add button",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "TextList",
      "import": {
        "from": "frui/form/TextList",
        "default": true
      },
      "attributes": {
        "type": "string"
      }
    }
  },
  "suggest": {
    "type": [ "flag", "method" ],
    "name": "field.suggest",
    "description": "Use a suggest input to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-suggest-field" ]
      },
      {
        "spread": false,
        "type": [ "string[]" ],
        "name": "options",
        "required": false,
        "description": "List of select options.",
        "examples": [ [ "Option 1", "Option 2", "Option 3" ] ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "remote",
        "required": false,
        "description": "Remote data source URL (should return string array).",
        "examples": [ "https://api.example.com/suggestions?q={QUERY}" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "SuggestInput",
      "import": {
        "from": "frui/form/SuggestInput",
        "default": true
      },
      "attributes": {}
    }
  },
  "switch": {
    "type": [ "flag", "method" ],
    "name": "field.switch",
    "description": "Use a switch to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "blue",
        "required": false,
        "description": "Show blue checkbox",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "check",
        "required": false,
        "description": "Show check when checked",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "checked",
        "required": false,
        "description": "Default checked state (Controlled)",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "circle",
        "required": false,
        "description": "Show circle when checked",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-switch" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "defaultChecked",
        "required": false,
        "description": "Default checked state (Uncontrolled)",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "label",
        "required": false,
        "description": "Shows text to the right of checkbox",
        "examples": [ "Enable feature" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "orange",
        "required": false,
        "description": "Show orange checkbox",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "rounded",
        "required": false,
        "description": "Make checkbox rounded",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "square",
        "required": false,
        "description": "Show square when checked",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "Switch",
      "import": {
        "from": "frui/form/Switch",
        "default": true
      },
      "attributes": {}
    }
  },
  "tags": {
    "type": [ "flag", "method" ],
    "name": "field.tags",
    "description": "Use a tag list input to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-tags-field" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "color",
        "required": false,
        "description": "Custom background color for tags",
        "examples": [ "#ff0000" ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "danger",
        "required": false,
        "description": "Red background color for tags",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "info",
        "required": false,
        "description": "Blue background color for tags",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "muted",
        "required": false,
        "description": "Gray background color for tags",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "placeholder",
        "required": false,
        "description": "Placeholders for input values.",
        "examples": [ "Add a tag" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "success",
        "required": false,
        "description": "Green background color for tags",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "warning",
        "required": false,
        "description": "Orange background color for tags",
        "examples": [ true ]
      }
    ],
    "data": {
      "name": "TagList",
      "import": {
        "from": "frui/form/TagList",
        "default": true
      },
      "attributes": {}
    }
  },
  "textarea": {
    "type": [ "flag", "method" ],
    "name": "field.textarea",
    "description": "Use a textarea to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-textarea-field" ]
      },
      {
        "spread": false,
        "type": [ "number" ],
        "name": "rows",
        "required": false,
        "description": "Number of visible rows",
        "examples": [ 5 ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "Textarea",
      "import": {
        "from": "frui/form/Textarea",
        "default": true
      },
      "attributes": {}
    }
  },
  "editor": {
    "type": [ "flag", "method" ],
    "name": "field.editor",
    "description": "Use a text editor to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "align",
        "required": false,
        "description": "Enable left, center, right alignment buttons",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "audio",
        "required": false,
        "description": "Enable audio embedding",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "blockquote",
        "required": false,
        "description": "Enable blockquote formatting button",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-text-editor-field" ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "code",
        "required": false,
        "description": "Enable code view toggle",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "color",
        "required": false,
        "description": "Enable text color picker",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "dir",
        "required": false,
        "description": "Set text direction (left-to-right or right-to-left)",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "fullscreen",
        "required": false,
        "description": "Enable fullscreen toggle",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "history",
        "required": false,
        "description": "Enable undo/redo buttons",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "font",
        "required": false,
        "description": "Enable font family selection",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "format",
        "required": false,
        "description": "Enable block format options (e.g., headings)",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "highlight",
        "required": false,
        "description": "Enable background highlight picker",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "indent",
        "required": false,
        "description": "Enable indent/outdent buttons",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "lineheight",
        "required": false,
        "description": "Enable line height selection",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "link",
        "required": false,
        "description": "Enable link insertion",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "list",
        "required": false,
        "description": "Enable ordered/unordered list buttons",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "math",
        "required": false,
        "description": "Enable math expression insertion",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "paragraph",
        "required": false,
        "description": "Enable paragraph formatting button",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "preview",
        "required": false,
        "description": "Enable content preview in new window",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "remove",
        "required": false,
        "description": "Enable remove format button (preserves inherited styles)",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "rule",
        "required": false,
        "description": "Enable horizontal rule button",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "showblocks",
        "required": false,
        "description": "Enable block visibility toggle",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "size",
        "required": false,
        "description": "Enable font size selection",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "table",
        "required": false,
        "description": "Enable table insertion",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "text",
        "required": false,
        "description": "Enable strikethrough, subscript, superscript buttons",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "textStyle",
        "required": false,
        "description": "Enable custom text styles (e.g., Code, Shadow) with single-style application",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "video",
        "required": false,
        "description": "Enable video embedding",
        "examples": [ true ]
      }
    ],
    "data": {
      "name": "TextEditor",
      "import": {
        "from": "frui/form/TextEditor",
        "default": true
      },
      "attributes": {}
    }
  },
  "textlist": {
    "type": [ "flag", "method" ],
    "name": "field.textlist",
    "description": "Use a text list to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "add",
        "required": false,
        "description": "Add button text",
        "examples": [ "Add Item" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names applied to the add button",
        "examples": [ "my-text-list" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "placeholder",
        "required": false,
        "description": "Placeholders for input values.",
        "examples": [ "Enter text" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object applied to the add button",
        "examples": [ { "marginTop": "10px" } ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "type",
        "required": false,
        "description": "Type of input for the text list items.",
        "examples": [ "text", "number", "date", "datetime", "time" ]
      }
    ],
    "data": {
      "name": "TextList",
      "import": {
        "from": "frui/form/TextList",
        "default": true
      },
      "attributes": {}
    }
  },
  "time": {
    "type": [ "flag", "method" ],
    "name": "field.time",
    "description": "Use a time input to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-time-field" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "TimeInput",
      "import": {
        "from": "frui/form/TimeInput",
        "default": true
      },
      "attributes": {}
    }
  },
  "timelist": {
    "type": [ "flag", "method" ],
    "name": "field.timelist",
    "description": "Use a time list to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "add",
        "required": false,
        "description": "Add button text",
        "examples": [ "Add Item" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names applied to the add button",
        "examples": [ "my-text-list" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "placeholder",
        "required": false,
        "description": "Placeholders for input values.",
        "examples": [ "Enter text" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object applied to the add button",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "TextList",
      "import": {
        "from": "frui/form/TextList",
        "default": true
      },
      "attributes": {
        "type": "time"
      }
    }
  },
  "url": {
    "type": [ "component"],
    "name": "field.url",
    "description": "Use a URL input to represent this column in a field.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-url-field" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "Input",
      "import": {
        "from": "frui/form/Input",
        "default": true
      },
      "attributes": { "type": "url" }
    }
  }
};

//special fields
field.fieldset = {
  "type": [ "component" ],
  "name": "field.fieldset",
  "description": "Special fieldset field to group other fields together.",
  "args": [],
  "data": {
    "name": "Fieldset",
    "import": {
      "from": "Fieldset",
      "default": true
    },
    "attributes": {}
  }
};

field.relation = {
  "type": [ "flag", "method" ],
  "name": "field.relation",
  "description": "Special relation field to link to another model.",
  "args": [
    {
      "spread": false,
      "type": [ "string" ],
      "name": "id",
      "required": true,
      "description": "ID name to be used as the select value",
      "examples": [ "id" ]
    },
    {
      "spread": false,
      "type": [ "string" ],
      "name": "search",
      "required": true,
      "description": "Search URL to be used for fetching related data",
      "examples": [ "/admin/profile/search?json" ]
    },
    {
      "spread": false,
      "type": [ "string" ],
      "name": "template",
      "required": true,
      "description": "Template used to display related items in the select options",
      "examples": [ "{{name}}" ]
    },
  ],
  "data": {
    "name": "Relation",
    "import": {
      "from": "Relation",
      "default": true
    },
    "attributes": {}
  }
};

//aliases
//add aliases
field.taglist = { ...field.tags, name: 'field.taglist' };
// type to field aliases
field.string = { ...field.input, name: 'field.string' };
field.text = { ...field.textarea, name: 'field.text' };
field.float = { ...field.number, name: 'field.float' };
field.boolean = { ...field.switch, name: 'field.boolean' };
field.object = { ...field.json, name: 'field.object' };
field.hash = { ...field.json, name: 'field.hash' };
//type multiple to field aliases
field.strings = { ...field.stringlist, name: 'field.strings' };
field.texts = { ...field.stringlist, name: 'field.texts' };
field.dates = { ...field.datelist, name: 'field.dates' };
field.datetimes = { ...field.datetimelist, name: 'field.datetimes' };
field.times = { ...field.timelist, name: 'field.times' };
field.integerlist = { ...field.numberlist, name: 'field.integerlist' };
field.integers = { ...field.numberlist, name: 'field.integers' };
field.floatlist = { ...field.numberlist, name: 'field.floatlist' };
field.floats = { ...field.numberlist, name: 'field.floats' };
field.numbers = { ...field.numberlist, name: 'field.numbers' };
//TODO: field.jsonlist
//field.objects = field.jsonlist;
//field.hashes = field.jsonlist;

//--------------------------------------------------------------------//
// Builtin View Attribute Definitions

const view: AttributeDataMap<AttributeDataComponent> = {
  "capitalize": {
    "type": [ "flag", "method" ],
    "name": "view.capitalize",
    "description": "Use capitalize to represent this column in a detail view.",
    "args": [],
    "data": {
      "name": "TextTransform",
      "import": {
        "from": "frui/view/TextTransform",
        "default": true
      },
      "attributes": { "format": "capitalize" }
    }
  },
  "carousel": {
    "type": [ "flag", "method" ],
    "name": "view.carousel",
    "description": "Use image carousel to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "auto",
        "required": false,
        "description": "Enable auto sliding",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-carousel-view" ]
      },
      {
        "spread": false,
        "type": [ "number" ],
        "name": "defaultIndex",
        "required": false,
        "description": "Starting index (uncontrolled)",
        "examples": [ 0 ]
      },
      {
        "spread": false,
        "type": [ "string", "CSS Object" ],
        "name": "film",
        "required": false,
        "description": "Class name or style object to apply to the film",
        "examples": [ "custom-film-class", { "marginTop": "10px" } ]
      },
      {
        "spread": false,
        "type": [ "string", "CSS Object" ],
        "name": "frame",
        "required": false,
        "description": "Class name or style object to apply to the frame",
        "examples": [ "custom-frame-class", { "marginTop": "10px" } ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "hidden",
        "required": false,
        "description": "Enable overflow hidden",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "string", "CSS Object" ],
        "name": "image",
        "required": false,
        "description": "Class name or style object to apply to each image",
        "examples": [ "custom-image-class", { "marginTop": "10px" } ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "repeat",
        "required": false,
        "description": "Whether to repeat the carousel",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "scroll",
        "required": false,
        "description": "Enable overflow scroll bars",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "ImageCarousel",
      "import": {
        "from": "frui/view/ImageCarousel",
        "default": true
      },
      "attributes": {}
    }
  },
  "chars": {
    "type": [ "flag", "method" ],
    "name": "view.chars",
    "description": "Use chars to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "string", "number" ],
        "name": "length",
        "required": false,
        "description": "Maximum length before truncation",
        "examples": [ 100 ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "hellip",
        "required": false,
        "description": "Use ellipsis character (…) for truncation",
        "examples": [ true ]
      }
    ],
    "data": {
      "name": "TextOverflow",
      "import": {
        "from": "frui/view/TextOverflow",
        "default": true
      },
      "attributes": {}
    }
  },
  "code": {
    "type": [ "flag", "method" ],
    "name": "view.code",
    "description": "Use code view to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "addDefaultStyles",
        "required": false,
        "description": "Whether to add default styles to the code view",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-code-view" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "langClassName",
        "required": false,
        "description": "Standard HTML class names for the language label",
        "examples": [ "my-lang-class" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "langStyle",
        "required": false,
        "description": "Standard CSS object for the language label",
        "examples": [ { "fontSize": "12px", "color": "#888888" } ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "language",
        "required": true,
        "description": "Programming language of the code block",
        "examples": [ "javascript" ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "numbers",
        "required": false,
        "description": "Whether to show line numbers",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "showLanguage",
        "required": false,
        "description": "Whether to show the language label",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "showLineNumbers",
        "required": false,
        "description": "Whether to show line numbers",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "number" ],
        "name": "startingLineNumber",
        "required": false,
        "description": "The starting line number for the code block",
        "examples": [ 1 ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "Code",
      "import": {
        "from": "frui/view/Code",
        "default": true
      },
      "attributes": {}
    }
  },
  "color": {
    "type": [ "flag", "method" ],
    "name": "view.color",
    "description": "Use color view to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "box",
        "required": false,
        "description": "Show color box",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-color-view" ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "lg",
        "required": false,
        "description": "Large size color box",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "md",
        "required": false,
        "description": "Medium size color box",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "sm",
        "required": false,
        "description": "Small size color box",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "text",
        "required": false,
        "description": "Show color text",
        "examples": [ true ]
      }
    ],
    "data": {
      "name": "Color",
      "import": {
        "from": "frui/view/Color",
        "default": true
      },
      "attributes": {}
    }
  },
  "comma": {
    "type": [ "flag", "method" ],
    "name": "view.comma",
    "description": "Use comma separator to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-comma-view" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "Spread",
      "import": {
        "from": "frui/view/Spread",
        "default": true
      },
      "attributes": { "separator": ", "}
    }
  },
  "country": {
    "type": [ "flag", "method" ],
    "name": "view.country",
    "description": "Use country view to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-country-view" ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "flag",
        "required": false,
        "description": "Show country flag",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "lg",
        "required": false,
        "description": "Large size flag",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "md",
        "required": false,
        "description": "Medium size flag",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "sm",
        "required": false,
        "description": "Small size flag",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "text",
        "required": false,
        "description": "Show country text",
        "examples": [ true ]
      }
    ],
    "data": {
      "name": "Country",
      "import": {
        "from": "frui/view/Country",
        "default": true
      },
      "attributes": {}
    }
  },
  "currency": {
    "type": [ "flag", "method" ],
    "name": "view.currency",
    "description": "Use currency view to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-currency-view" ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "flag",
        "required": false,
        "description": "Show country flag",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "lg",
        "required": false,
        "description": "Large size flag",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "md",
        "required": false,
        "description": "Medium size flag",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "sm",
        "required": false,
        "description": "Small size flag",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "text",
        "required": false,
        "description": "Show currency text",
        "examples": [ true ]
      }
    ],
    "data": {
      "name": "Currency",
      "import": {
        "from": "frui/view/Currency",
        "default": true
      },
      "attributes": {}
    }
  },
  "date": {
    "type": [ "flag", "method" ],
    "name": "view.date",
    "description": "Use date view to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "locale",
        "required": false,
        "description": "Locale for date formatting",
        "examples": [ "en", "fr", "de" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "format",
        "required": false,
        "description": "Date format string (e.g., 'MM/DD/YYYY')",
        "examples": [ "MMMM Do YYYY, h:mm:ss a", "MM/DD/YYYY" ]
      }
    ],
    "data": {
      "name": "DateFormat",
      "import": {
        "from": "frui/view/DateFormat",
        "default": true
      },
      "attributes": {}
    }
  },
  "email": {
    "type": [ "flag", "method" ],
    "name": "view.email",
    "description": "Use email link view to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-email-view" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "target",
        "required": false,
        "description": "Link target attribute",
        "examples": [ "_blank", "_self" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "title",
        "required": false,
        "description": "Link title attribute",
        "examples": [ "Email this customer" ]
      }
    ],
    "data": {
      "name": "EmailLink",
      "import": {
        "from": "frui/view/EmailLink",
        "default": true
      },
      "attributes": {}
    }
  },
  "formula": {
    "type": [ "flag", "method" ],
    "name": "view.formula",
    "description": "Use a formula to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "formula",
        "required": false,
        "description": "Formula string",
        "examples": [ "{{price}} + {{tax}} - {{this}} / 4" ]
      }
    ],
    "data": {
      "name": "Formula",
      "import": {
        "from": "frui/view/Formula",
        "default": true
      },
      "attributes": {}
    }
  },
  "html": {
    "type": [ "flag", "method" ],
    "name": "view.html",
    "description": "Use HTML to represent this column in a detail view.",
    "args": [],
    "data": {
      "name": "HTML",
      "import": {
        "from": "frui/view/HTML",
        "default": true
      },
      "attributes": {}
    }
  },
  "image": {
    "type": [ "flag", "method" ],
    "name": "view.image",
    "description": "Use image view to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "alt",
        "required": false,
        "description": "Image alt attribute",
        "examples": [ "A descriptive text for the image" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-image-view" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "Image",
      "import": {
        "from": "frui/view/Image",
        "default": true
      },
      "attributes": {}
    }
  },
  "json": {
    "type": [ "flag", "method" ],
    "name": "view.json",
    "description": "Use code view to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "addDefaultStyles",
        "required": false,
        "description": "Whether to add default styles to the code view",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-code-view" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "langClassName",
        "required": false,
        "description": "Standard HTML class names for the language label",
        "examples": [ "my-lang-class" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "langStyle",
        "required": false,
        "description": "Standard CSS object for the language label",
        "examples": [ { "fontSize": "12px", "color": "#888888" } ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "numbers",
        "required": false,
        "description": "Whether to show line numbers",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "showLanguage",
        "required": false,
        "description": "Whether to show the language label",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "showLineNumbers",
        "required": false,
        "description": "Whether to show line numbers",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "number" ],
        "name": "startingLineNumber",
        "required": false,
        "description": "The starting line number for the code block",
        "examples": [ 1 ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "Code",
      "import": {
        "from": "frui/view/Code",
        "default": true
      },
      "attributes": {
        "language": "json"
      }
    }
  },
  "film": {
    "type": [ "flag", "method" ],
    "name": "view.film",
    "description": "Use image film to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-film-view" ]
      },
      {
        "spread": false,
        "type": [ "string", "CSS Object" ],
        "name": "frame",
        "required": false,
        "description": "Class name or style object to apply to the frame",
        "examples": [ "custom-frame-class", { "marginTop": "10px" } ]
      },
      {
        "spread": false,
        "type": [ "string", "CSS Object" ],
        "name": "image",
        "required": false,
        "description": "Class name or style object to apply to each image",
        "examples": [ "custom-image-class", { "marginTop": "10px" } ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "ImageFilm",
      "import": {
        "from": "frui/view/ImageFilm",
        "default": true
      },
      "attributes": {}
    }
  },
  "line": {
    "type": [ "flag", "method" ],
    "name": "view.line",
    "description": "Use line separator to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-comma-view" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "Spread",
      "import": {
        "from": "frui/view/Spread",
        "default": true
      },
      "attributes": { "separator": "line"}
    }
  },
  "link": {
    "type": [ "flag", "method" ],
    "name": "view.link",
    "description": "Use link view to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-link-view" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "target",
        "required": false,
        "description": "Link target attribute",
        "examples": [ "_blank", "_self" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "title",
        "required": false,
        "description": "Link title attribute",
        "examples": [ "Click this link" ]
      }
    ],
    "data": {
      "name": "Link",
      "import": {
        "from": "frui/view/Link",
        "default": true
      },
      "attributes": {}
    }
  },
  "list": {
    "type": [ "flag", "method" ],
    "name": "view.list",
    "description": "Use a list view to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "ordered",
        "required": false,
        "description": "Whether the list is ordered (numbered)",
        "examples": [ true ]
      }
    ],
    "data": {
      "name": "List",
      "import": {
        "from": "frui/view/List",
        "default": true
      },
      "attributes": {}
    }
  },
  "lowercase": {
    "type": [ "flag", "method" ],
    "name": "view.lowercase",
    "description": "Use lowercase to represent this column in a detail view.",
    "args": [],
    "data": {
      "name": "TextTransform",
      "import": {
        "from": "frui/view/TextTransform",
        "default": true
      },
      "attributes": { "format": "lowercase" }
    }
  },
  "markdown": {
    "type": [ "flag", "method" ],
    "name": "view.markdown",
    "description": "Use markdown to represent this column in a detail view.",
    "args": [],
    "data": {
      "name": "Markdown",
      "import": {
        "from": "frui/view/Markdown",
        "default": true
      },
      "attributes": {}
    }
  },
  "metadata": {
    "type": [ "flag", "method" ],
    "name": "view.metadata",
    "description": "Use metadata view to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-metadata-view" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "Metadata",
      "import": {
        "from": "frui/view/Metadata",
        "default": true
      },
      "attributes": {}
    }
  },
  "number": {
    "type": [ "flag", "method" ],
    "name": "view.number",
    "description": "Use number format to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "absolute",
        "required": false,
        "description": "Whether to display the absolute value",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "decimal",
        "required": false,
        "description": "Decimal point character",
        "examples": [ "." ]
      },
      {
        "spread": false,
        "type": [ "number" ],
        "name": "decimals",
        "required": false,
        "description": "Number of decimal places to display",
        "examples": [ 2 ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "separator",
        "required": false,
        "description": "Thousands separator character",
        "examples": [ "," ]
      }
    ],
    "data": {
      "name": "NumberFormat",
      "import": {
        "from": "frui/view/NumberFormat",
        "default": true
      },
      "attributes": {}
    }
  },
  "ol": {
    "type": [ "flag", "method" ],
    "name": "view.ol",
    "description": "Use an ordered list to represent this column in a detail view.",
    "args": [],
    "data": {
      "name": "List",
      "import": {
        "from": "frui/view/List",
        "default": true
      },
      "attributes": { ordered: true }
    }
  },
  "phone": {
    "type": [ "flag", "method" ],
    "name": "view.phone",
    "description": "Use phone link view to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-phone-view" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "target",
        "required": false,
        "description": "Link target attribute",
        "examples": [ "_blank", "_self" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "title",
        "required": false,
        "description": "Link title attribute",
        "examples": [ "Call this customer" ]
      }
    ],
    "data": {
      "name": "PhoneLink",
      "import": {
        "from": "frui/view/PhoneLink",
        "default": true
      },
      "attributes": {}
    }
  },
  "price": {
    "type": [ "flag", "method" ],
    "name": "view.price",
    "description": "Use number format to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "absolute",
        "required": false,
        "description": "Whether to display the absolute value",
        "examples": [ true ]
      }
    ],
    "data": {
      "name": "NumberFormat",
      "import": {
        "from": "frui/view/NumberFormat",
        "default": true
      },
      "attributes": {
        "decimals": 2,
        "separator": ",",
        "decimal": "."
      }
    }
  },
  "rating": {
    "type": [ "flag", "method" ],
    "name": "view.rating",
    "description": "Use rating view to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "number" ],
        "name": "max",
        "required": false,
        "description": "Maximum rating value",
        "examples": [ 5 ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "remainder",
        "required": false,
        "description": "Whether to show the remainder of the rating",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "round",
        "required": false,
        "description": "Rounding method",
        "examples": [ "round", "ceil", "floor" ]
      }
    ],
    "data": {
      "name": "Rating",
      "import": {
        "from": "frui/view/Rating",
        "default": true
      },
      "attributes": {}
    }
  },
  "rel": {
    "type": [ "flag", "method" ],
    "name": "view.rel",
    "description": "Use short relative date to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "locale",
        "required": false,
        "description": "Locale for date formatting",
        "examples": [ "en", "fr", "de" ]
      }
    ],
    "data": {
      "name": "DateFormat",
      "import": {
        "from": "frui/view/DateFormat",
        "default": true
      },
      "attributes": { "format": "a" }
    }
  },
  "relative": {
    "type": [ "flag", "method" ],
    "name": "view.relative",
    "description": "Use relative date to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "locale",
        "required": false,
        "description": "Locale for date formatting",
        "examples": [ "en", "fr", "de" ]
      }
    ],
    "data": {
      "name": "DateFormat",
      "import": {
        "from": "frui/view/DateFormat",
        "default": true
      },
      "attributes": { "format": "ago" }
    }
  },
  "spread": {
    "type": [ "flag", "method" ],
    "name": "view.spread",
    "description": "Use spread view to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-spread-view" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "separator",
        "required": false,
        "description": "Separator string between values",
        "examples": [ ", " ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "Spread",
      "import": {
        "from": "frui/view/Spread",
        "default": true
      },
      "attributes": {}
    }
  },
  "tabular": {
    "type": [ "flag", "method" ],
    "name": "view.tabular",
    "description": "Use tabular view to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-tabular-view" ]
      },
      {
        "spread": false,
        "type": [ "string[]" ],
        "name": "stripes",
        "required": false,
        "description": "Array of three colors for row striping",
        "examples": [ [ "#ffffff", "#f9f9f9", "#f0f0f0" ] ]
      }
    ],
    "data": {
      "name": "Tabular",
      "import": {
        "from": "frui/view/Tabular",
        "default": true
      },
      "attributes": {}
    }
  },
  "tags": {
    "type": [ "flag", "method" ],
    "name": "view.tags",
    "description": "Use tabular view to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "className",
        "required": false,
        "description": "Standard HTML class names",
        "examples": [ "my-tabular-view" ]
      },
      {
        "spread": false,
        "type": [ "CSS Object" ],
        "name": "style",
        "required": false,
        "description": "Standard CSS object",
        "examples": [ { "marginTop": "10px" } ]
      }
    ],
    "data": {
      "name": "Tags",
      "import": {
        "from": "frui/view/Tags",
        "default": true
      },
      "attributes": {}
    }
  },
  "time": {
    "type": [ "flag", "method" ],
    "name": "view.time",
    "description": "Use time view to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "locale",
        "required": false,
        "description": "Locale for date formatting",
        "examples": [ "en", "fr", "de" ]
      }
    ],
    "data": {
      "name": "DateFormat",
      "import": {
        "from": "frui/view/DateFormat",
        "default": true
      },
      "attributes": {
        "format": "HH:mm:ss"
      }
    }
  },
  "overflow": {
    "type": [ "flag", "method" ],
    "name": "view.overflow",
    "description": "Use text overflow to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "string", "number" ],
        "name": "length",
        "required": false,
        "description": "Maximum length before truncation",
        "examples": [ 100 ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "words",
        "required": false,
        "description": "Truncate at word boundaries",
        "examples": [ true ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "hellip",
        "required": false,
        "description": "Use ellipsis character (…) for truncation",
        "examples": [ true ]
      }
    ],
    "data": {
      "name": "TextOverflow",
      "import": {
        "from": "frui/view/TextOverflow",
        "default": true
      },
      "attributes": {}
    }
  },
  "text": {
    "type": [ "flag", "method" ],
    "name": "view.text",
    "description": "Use text format to represent this column in a detail view.",
    "args": [],
    "data": {
      "name": "TextTransform",
      "import": {
        "from": "frui/view/TextTransform",
        "default": true
      },
      "attributes": { "format": "none" }
    }
  },
  "transform": {
    "type": [ "flag", "method" ],
    "name": "view.transform",
    "description": "Use transform format to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "format",
        "required": false,
        "description": "Text transfield format",
        "examples": [ "uppercase", "lowercase", "capitalize", "none" ]
      }
    ],
    "data": {
      "name": "TextTransform",
      "import": {
        "from": "frui/view/TextTransform",
        "default": true
      },
      "attributes": {}
    }
  },
  "ul": {
    "type": [ "flag", "method" ],
    "name": "view.ul",
    "description": "Use an unordered list view to represent this column in a detail view.",
    "args": [],
    "data": {
      "name": "List",
      "import": {
        "from": "frui/view/List",
        "default": true
      },
      "attributes": {}
    }
  },
  "uppercase": {
    "type": [ "flag", "method" ],
    "name": "view.uppercase",
    "description": "Use uppercase to represent this column in a detail view.",
    "args": [],
    "data": {
      "name": "TextTransform",
      "import": {
        "from": "frui/view/TextTransform",
        "default": true
      },
      "attributes": { "format": "uppercase" }
    }
  },
  "words": {
    "type": [ "flag", "method" ],
    "name": "view.words",
    "description": "Use words to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "string", "number" ],
        "name": "length",
        "required": false,
        "description": "Maximum length before truncation",
        "examples": [ 100 ]
      },
      {
        "spread": false,
        "type": [ "boolean" ],
        "name": "hellip",
        "required": false,
        "description": "Use ellipsis character (…) for truncation",
        "examples": [ true ]
      }
    ],
    "data": {
      "name": "TextOverflow",
      "import": {
        "from": "frui/view/TextOverflow",
        "default": true
      },
      "attributes": { words: true }
    }
  },
  "yesno": {
    "type": [ "flag", "method" ],
    "name": "view.yesno",
    "description": "Use yes/no view to represent this column in a detail view.",
    "args": [
      {
        "spread": false,
        "type": [ "string" ],
        "name": "yes",
        "required": false,
        "description": "Text to display for true values",
        "examples": [ "Yes" ]
      },
      {
        "spread": false,
        "type": [ "string" ],
        "name": "no",
        "required": false,
        "description": "Text to display for false values",
        "examples": [ "No" ]
      }
    ],
    "data": {
      "name": "YesNo",
      "import": {
        "from": "frui/view/YesNo",
        "default": true
      },
      "attributes": {}
    }
  }
};

//special fields
view.fieldset = {
  "type": [ "component" ],
  "name": "view.fieldset",
  "description": "Special fieldset view to group other fields together.",
  "args": [],
  "data": {
    "name": "Fieldset",
    "import": {
      "from": "Fieldset",
      "default": true
    },
    "attributes": {}
  }
};

view.template = {
  "type": [ "component" ],
  "name": "view.template",
  "description": "Special template view used to render custom content using a template string.",
  "args": [
    {
      "spread": false,
      "type": [ "string" ],
      "name": "template",
      "required": true,
      "description": "The template string",
      "examples": [ "Name: {{name}}" ]
    }
  ],
  "data": {
    "name": "Template",
    "import": {
      "from": "Template",
      "default": true
    },
    "attributes": {}
  }
};

//aliases
view.taglist = { ...view.tags, name: 'view.taglist' };
//type to view aliases
view.string = { ...view.text, name: 'view.string' };
view.float = { ...view.number, name: 'view.float' };
view.integer = { ...view.number, name: 'view.integer' };
view.boolean = { ...view.yesno, name: 'view.boolean' };
view.datetime = { ...view.date, name: 'view.datetime' };
view.object = { ...view.json, name: 'view.object' };
view.hash = { ...view.json, name: 'view.hash' };
//type multiple to view aliases
view.strings = { ...view.list, name: 'view.strings' };
view.texts = { ...view.list, name: 'view.texts' };
view.dates = { ...view.list, name: 'view.dates' };
view.datetimes = { ...view.list, name: 'view.datetimes' };
view.times = { ...view.list, name: 'view.times' };
view.integers = { ...view.list, name: 'view.integers' };
view.floats = { ...view.list, name: 'view.floats' };
view.numbers = { ...view.list, name: 'view.numbers' };
view.stringlist = { ...view.list, name: 'view.stringlist' };
view.textlist = { ...view.list, name: 'view.textlist' };
view.datelist = { ...view.list, name: 'view.datelist' };
view.datetimelist = { ...view.list, name: 'view.datetimelist' };
view.timelist = { ...view.list, name: 'view.timelist' };
view.integerlist = { ...view.list, name: 'view.integerlist' };
view.floatlist = { ...view.list, name: 'view.floatlist' };
view.numberlist = { ...view.list, name: 'view.numberlist' };
//TODO: view.jsonlist
//view.objects = view.list;
//view.hashes = view.list;

//--------------------------------------------------------------------//
// Builtin List Attribute Definitions

const list = mapObjectValue(view, value => ({
  ...value,
  name: value.name.replace('view.', 'list.')
}));

//--------------------------------------------------------------------//
// Builtin Filter Attribute Definitions

const filter = mapObjectValue(field, value => ({
  ...value,
  name: value.name.replace('field.', 'filter.')
}));

//--------------------------------------------------------------------//
// Builtin Span Attribute Definitions

const span = mapObjectValue(field, value => ({
  ...value,
  name: value.name.replace('field.', 'span.')
}));

export {
  schema,
  column,
  assert,
  field,
  view,
  list,
  filter,
  span
};

