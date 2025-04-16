import type { ColumnOption } from '../types.js';

export default {
  "none": {
    "name": false,
    "attributes": {}
  },
  "lower": {
    "name": "Text",
    "attributes": {
      "format": "lowercase"
    }
  },
  "upper": {
    "name": "Text",
    "attributes": {
      "format": "uppercase"
    }
  },
  "capital": {
    "name": "Text",
    "attributes": {
      "format": "capitalize"
    }
  },
  "text": {
    "name": "Text",
    "attributes": {}
  },
  "char": {
    "name": "Overflow",
    "attributes": {
      "hellip": true
    }
  },
  "word": {
    "name": "Overflow",
    "attributes": {
      "word": true,
      "hellip": true
    }
  },
  "overflow": {
    "name": "Overflow",
    "attributes": {}
  },
  "number": {
    "name": "Number",
    "attributes": {
      "separator": ",",
      "decimal": "."
    }
  },
  "price": {
    "name": "Number",
    "attributes": {
      "decimals": 2,
      "separator": ",",
      "decimal": "."
    }
  },
  "yesno": {
    "name": "Yesno",
    "attributes": {
      "yes": "Yes",
      "no": "No"
    }
  },
  "rating": {
    "name": "Rating",
    "attributes": {}
  },
  "date": {
    "name": "Date",
    "attributes": {}
  },
  "relative": {
    "name": "Date",
    "attributes": {
      "format": "ago"
    }
  },
  "rel": {
    "name": "Date",
    "attributes": {
      "format": "a"
    }
  },
  "html": {
    "name": "HTML",
    "attributes": {}
  },
  "escaped": {
    "name": false,
    "attributes": {}
  },
  "markdown": {
    "name": "Markdown",
    "attributes": {}
  },
  "color": {
    "name": "Color",
    "attributes": {}
  },
  "link": {
    "name": "Link",
    "attributes": {}
  },
  "image": {
    "name": "Image",
    "attributes": {}
  },
  "email": {
    "name": "Email",
    "attributes": {}
  },
  "phone": {
    "name": "Phone",
    "attributes": {}
  },
  "space": {
    "name": "Separated",
    "attributes": {
      "separator": " "
    }
  },
  "comma": {
    "name": "Separated",
    "attributes": {
      "separator": ", "
    }
  },
  "line": {
    "name": "Separated",
    "attributes": {
      "separator": "line"
    }
  },
  "ol": {
    "name": "List",
    "attributes": {
      "ordered": true
    }
  },
  "ul": {
    "name": "List",
    "attributes": {}
  },
  "tags": {
    "name": "Taglist",
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
  "carousel": {
    "name": "Imagelist",
    "attributes": {}
  },
  "pretty": {
    "name": "JSON",
    "attributes": {}
  },
  "hide": {
    "name": false,
    "attributes": {}
  },
  "custom": {
    "name": false,
    "attributes": {}
  },
  "formula": {
    "name": "Formula",
    "attributes": {}
  },
  "detail": {
    "name": "Link",
    "attributes": {}
  },
  "template": {
    "name": "HTML",
    "attributes": {}
  },
  "fieldset": {
    "name": "Fieldset",
    "attributes": {}
  }
} as Record<string, ColumnOption>;