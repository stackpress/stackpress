//stackpress/schema
import type { 
  TypeMapDataAssertion,
  TypeMapDataMap,
  TypeMapDataSerializer
} from '../types.js';

//--------------------------------------------------------------------//
// Assertion Maps

const assertions: TypeMapDataMap<TypeMapDataAssertion> = {
  String: {
    "name": "string",
    "import": {
      "from": "stackpress/schema/assert",
      "default": false
    },
    "message": "Must be a string."
  },
  Text: {
    "name": "string",
    "import": {
      "from": "stackpress/schema/assert",
      "default": false
    },
    "message": "Must be a string."
  },
  Number: {
    "name": "number",
    "import": {
      "from": "stackpress/schema/assert",
      "default": false
    },
    "message": "Must be a number."
  },
  Integer: {
    "name": "integer",
    "import": {
      "from": "stackpress/schema/assert",
      "default": false
    },
    "message": "Must be a valid integer format."
  },
  Float: {
    "name": "float",
    "import": {
      "from": "stackpress/schema/assert",
      "default": false
    },
    "message": "Must be a valid float number."
  },
  Boolean: {
    "name": "boolean",
    "import": {
      "from": "stackpress/schema/assert",
      "default": false
    },
    "message": "Must be a boolean."
  },
  Date: {
    "name": "date",
    "import": {
      "from": "stackpress/schema/assert",
      "default": false
    },
    "message": "Must be a valid date."
  },
  Datetime: {
    "name": "date",
    "import": {
      "from": "stackpress/schema/assert",
      "default": false
    },
    "message": "Must be a valid date."
  },
  Time: {
    "name": "date",
    "import": {
      "from": "stackpress/schema/assert",
      "default": false
    },
    "message": "Must be a valid date."
  },
  Object: {
    "name": "object",
    "import": {
      "from": "stackpress/schema/assert",
      "default": false
    },
    "message": "Must be an object."
  },
  Hash: {
    "name": "object",
    "import": {
      "from": "stackpress/schema/assert",
      "default": false
    },
    "message": "Must be an object."
  },
  Json: {
    "name": "object",
    "import": {
      "from": "stackpress/schema/assert",
      "default": false
    },
    "message": "Must be an object."
  }
};

//--------------------------------------------------------------------//
// Serializer Maps

const serializers: TypeMapDataMap<TypeMapDataSerializer> = {
  String: {
    "name": "StringSerializer",
    "import": {
      "from": "stackpress/schema/specs/serializer/StringSerializer",
      "default": false
    }
  },
  Text: {
    "name": "StringSerializer",
    "import": {
      "from": "stackpress/schema/specs/serializer/StringSerializer",
      "default": false
    }
  },
  Number: {
    "name": "NumberSerializer",
    "import": {
      "from": "stackpress/schema/specs/serializer/NumberSerializer",
      "default": false
    }
  },
  Integer: {
    "name": "NumberSerializer",
    "import": {
      "from": "stackpress/schema/specs/serializer/NumberSerializer",
      "default": false
    }
  },
  Float: {
    "name": "NumberSerializer",
    "import": {
      "from": "stackpress/schema/specs/serializer/NumberSerializer",
      "default": false
    }
  },
  Boolean: {
    "name": "BooleanSerializer",
    "import": {
      "from": "stackpress/schema/specs/serializer/BooleanSerializer",
      "default": false
    }
  },
  Date: {
    "name": "DateSerializer",
    "import": {
      "from": "stackpress/schema/specs/serializer/DateSerializer",
      "default": false
    }
  },
  Datetime: {
    "name": "DateSerializer",
    "import": {
      "from": "stackpress/schema/specs/serializer/DateSerializer",
      "default": false
    }
  },
  Time: {
    "name": "DateSerializer",
    "import": {
      "from": "stackpress/schema/specs/serializer/DateSerializer",
      "default": false
    }
  },
  Object: {
    "name": "ObjectSerializer",
    "import": {
      "from": "stackpress/schema/specs/serializer/ObjectSerializer",
      "default": false
    }
  },
  Hash: {
    "name": "ObjectSerializer",
    "import": {
      "from": "stackpress/schema/specs/serializer/ObjectSerializer",
      "default": false
    }
  },
  Json: {
    "name": "ObjectSerializer",
    "import": {
      "from": "stackpress/schema/specs/serializer/ObjectSerializer",
      "default": false
    }
  },
  Unknown: {
    "name": "UnknownSerializer",
    "import": {
      "from": "stackpress/schema/specs/serializer/UnknownSerializer",
      "default": false
    }
  }
};


export { assertions, serializers };