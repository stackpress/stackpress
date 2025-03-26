import type { ColumnOption } from './types';

export default {
  "none": {
    "component": false,
    "attributes": {}
  },
  "lower": {
    "component": "Text",
    "attributes": {
      "format": "lowercase"
    }
  },
  "upper": {
    "component": "Text",
    "attributes": {
      "format": "uppercase"
    }
  },
  "capital": {
    "component": "Text",
    "attributes": {
      "format": "capitalize"
    }
  },
  "char": {
    "component": "Overflow",
    "attributes": {
      "hellip": true
    }
  },
  "word": {
    "component": "Overflow",
    "attributes": {
      "word": true,
      "hellip": true
    }
  },
  "number": {
    "component": "Number",
    "attributes": {
      "separator": ",",
      "decimal": "."
    }
  },
  "price": {
    "component": "Number",
    "attributes": {
      "decimals": 2,
      "separator": ",",
      "decimal": "."
    }
  },
  "yesno": {
    "component": "Yesno",
    "attributes": {
      "yes": "Yes",
      "no": "No"
    }
  },
  "rating": {
    "component": "Rating",
    "attributes": {}
  },
  "date": {
    "component": "Date",
    "attributes": {}
  },
  "relative": {
    "component": "Date",
    "attributes": {
      "format": "ago"
    }
  },
  "rel": {
    "component": "Date",
    "attributes": {
      "format": "a"
    }
  },
  "html": {
    "component": "HTML",
    "attributes": {}
  },
  "escaped": {
    "component": false,
    "attributes": {}
  },
  "markdown": {
    "component": "Markdown",
    "attributes": {}
  },
  "color": {
    "component": "Color",
    "attributes": {}
  },
  "link": {
    "component": "Link",
    "attributes": {}
  },
  "image": {
    "component": "Image",
    "attributes": {}
  },
  "email": {
    "component": "Email",
    "attributes": {}
  },
  "phone": {
    "component": "Phone",
    "attributes": {}
  },
  "space": {
    "component": "Separated",
    "attributes": {
      "separator": " "
    }
  },
  "comma": {
    "component": "Separated",
    "attributes": {
      "separator": ", "
    }
  },
  "line": {
    "component": "Separated",
    "attributes": {
      "separator": "line"
    }
  },
  "ol": {
    "component": "List",
    "attributes": {
      "ordered": true
    }
  },
  "ul": {
    "component": "List",
    "attributes": {}
  },
  "tags": {
    "component": "Taglist",
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
  "carousel": {
    "component": "Imagelist",
    "attributes": {}
  },
  "pretty": {
    "component": "JSON",
    "attributes": {}
  },
  "hide": {
    "component": false,
    "attributes": {}
  },
  "custom": {
    "component": false,
    "attributes": {}
  },
  "formula": {
    "component": "Formula",
    "attributes": {}
  },
  "detail": {
    "component": "Link",
    "attributes": {}
  }
} as Record<string, ColumnOption>;