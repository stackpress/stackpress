import type { ColumnOption } from './types';

export default {
  "none": {
    "component": false,
    "attributes": {}
  },
  "color": {
    "component": "Input",
    "attributes": { "type": "color" }
  },
  "email": {
    "component": "Input",
    "attributes": {
      "type": "email"
    }
  },
  "input": {
    "component": "Input",
    "attributes": {}
  },
  "mask": {
    "component": "Mask",
    "attributes": {}
  },
  "phone": {
    "component": "Input",
    "attributes": {
      "type": "phone"
    }
  },
  "password": {
    "component": "Password",
    "attributes": {}
  },
  "slug": {
    "component": "Slug",
    "attributes": {}
  },
  "text": {
    "component": "Input",
    "attributes": {
      "type": "text"
    }
  },
  "url": {
    "component": "Input",
    "attributes": {
      "type": "url"
    }
  },
  "code": {
    "component": "CodeEditor",
    "attributes": {}
  },
  "markdown": {
    "component": "Markdown",
    "attributes": {}
  },
  "textarea": {
    "component": "Textarea",
    "attributes": {}
  },
  "wysiwyg": {
    "component": "Wysiwyg",
    "attributes": {}
  },
  "integer": {
    "component": "Number",
    "attributes": {
      "step": 1
    }
  },
  "number": {
    "component": "Number",
    "attributes": {}
  },
  "price": {
    "component": "Number",
    "attributes": {
      "step": 0.01
    }
  },
  "range": {
    "component": "Range",
    "attributes": {}
  },
  "rating": {
    "component": "Rating",
    "attributes": {}
  },
  "small": {
    "component": "Number",
    "attributes": {
      "max": 9,
      "min": 0,
      "step": 1
    }
  },
  "date": {
    "component": "Date",
    "attributes": {}
  },
  "datetime": {
    "component": "Datetime",
    "attributes": {}
  },
  "time": {
    "component": "Time",
    "attributes": {}
  },
  "autocomplete": {
    "component": "Autocomplete",
    "attributes": {}
  },
  "checkbox": {
    "component": "Checkbox",
    "attributes": {}
  },
  "checklist": {
    "component": "Checklist",
    "attributes": {}
  },
  "country": {
    "component": "Country",
    "attributes": {}
  },
  "currency": {
    "component": "Currency",
    "attributes": {}
  },
  "radio": {
    "component": "Radio",
    "attributes": {}
  },
  "select": {
    "component": "Select",
    "attributes": {}
  },
  "selectlist": {
    "component": "Selectlist",
    "attributes": {}
  },
  "switch": {
    "component": "Switch",
    "attributes": {}
  },
  "file": {
    "component": "File",
    "attributes": {}
  },
  "filelist": {
    "component": "Filelist",
    "attributes": {}
  },
  "image": {
    "component": "Image",
    "attributes": {}
  },
  "imagelist": {
    "component": "Imagelist",
    "attributes": {}
  },
  "json": {
    "component": "JSON",
    "attributes": {}
  },
  "metadata": {
    "component": "Metadata",
    "attributes": {}
  },
  "table": {
    "component": "Table",
    "attributes": {}
  },
  "tags": {
    "component": "Taglist",
    "attributes": {}
  },
  "textlist": {
    "component": "Textlist",
    "attributes": {}
  },
  "fieldset": {
    "component": "Fieldset",
    "attributes": {}
  },
  "active": {
    "component": false,
    "attributes": {}
  },
  "created": {
    "component": false,
    "attributes": {}
  },
  "updated": {
    "component": false,
    "attributes": {}
  },
  "relation": {
    "component": "Select",
    "attributes": {
      "searchable": true
    }
  }
} as Record<string, ColumnOption>;