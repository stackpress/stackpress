import type { ColumnOption } from '../types.js';

export default {
  "none": {
    "name": false,
    "attributes": {}
  },
  "color": {
    "name": "Input",
    "attributes": { "type": "color" }
  },
  "email": {
    "name": "Input",
    "attributes": {
      "type": "email"
    }
  },
  "input": {
    "name": "Input",
    "attributes": {}
  },
  "mask": {
    "name": "Mask",
    "attributes": {}
  },
  "phone": {
    "name": "Input",
    "attributes": {
      "type": "phone"
    }
  },
  "password": {
    "name": "Password",
    "attributes": {}
  },
  "slug": {
    "name": "Slug",
    "attributes": {}
  },
  "text": {
    "name": "Input",
    "attributes": {
      "type": "text"
    }
  },
  "url": {
    "name": "Input",
    "attributes": {
      "type": "url"
    }
  },
  "code": {
    "name": "CodeEditor",
    "attributes": {}
  },
  "markdown": {
    "name": "Markdown",
    "attributes": {}
  },
  "textarea": {
    "name": "Textarea",
    "attributes": {}
  },
  "wysiwyg": {
    "name": "WYSIWYG",
    "attributes": {}
  },
  "integer": {
    "name": "Number",
    "attributes": {
      "step": 1
    }
  },
  "number": {
    "name": "Number",
    "attributes": {}
  },
  "price": {
    "name": "Number",
    "attributes": {
      "step": 0.01
    }
  },
  "range": {
    "name": "Input",
    "attributes": {
      "type": "range"
    }
  },
  "rating": {
    "name": "Rating",
    "attributes": {}
  },
  "small": {
    "name": "Number",
    "attributes": {
      "max": 9,
      "min": 0,
      "step": 1
    }
  },
  "date": {
    "name": "Date",
    "attributes": {}
  },
  "datetime": {
    "name": "Datetime",
    "attributes": {}
  },
  "time": {
    "name": "Time",
    "attributes": {}
  },
  "autocomplete": {
    "name": "Autocomplete",
    "attributes": {}
  },
  "checkbox": {
    "name": "Checkbox",
    "attributes": {}
  },
  "checklist": {
    "name": "Checklist",
    "attributes": {}
  },
  "country": {
    "name": "Country",
    "attributes": {}
  },
  "currency": {
    "name": "Currency",
    "attributes": {}
  },
  "radio": {
    "name": "Radio",
    "attributes": {}
  },
  "select": {
    "name": "Select",
    "attributes": {}
  },
  "selectlist": {
    "name": "Selectlist",
    "attributes": {}
  },
  "switch": {
    "name": "Switch",
    "attributes": {}
  },
  "file": {
    "name": "File",
    "attributes": {}
  },
  "filelist": {
    "name": "Filelist",
    "attributes": {}
  },
  "image": {
    "name": "Image",
    "attributes": {}
  },
  "imagelist": {
    "name": "Imagelist",
    "attributes": {}
  },
  "json": {
    "name": "JSON",
    "attributes": {}
  },
  "metadata": {
    "name": "Metadata",
    "attributes": {}
  },
  "table": {
    "name": "Table",
    "attributes": {}
  },
  "taglist": {
    "name": "Taglist",
    "attributes": {}
  },
  "textlist": {
    "name": "Textlist",
    "attributes": {}
  },
  "fieldset": {
    "name": "Fieldset",
    "attributes": {}
  },
  "active": {
    "name": false,
    "attributes": {}
  },
  "created": {
    "name": false,
    "attributes": {}
  },
  "updated": {
    "name": false,
    "attributes": {}
  },
  "relation": {
    "name": "Select",
    "attributes": {
      "searchable": true
    }
  }
} as Record<string, ColumnOption>;