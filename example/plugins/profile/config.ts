import Registry from 'stackpress/Registry';
import type { SchemaConfig } from 'stackpress/schema';

export const schema: SchemaConfig = {
  "model": {
    "Profile": {
      "name": "Profile",
      "mutable": true,
      "attributes": {
        "label": [
          "Profile",
          "Profiles"
        ],
        "template": [
          "{{name}}"
        ],
        "icon": [
          "user"
        ]
      },
      "columns": [
        {
          "type": "String",
          "name": "id",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "ID"
            ],
            "id": true,
            "default": [
              "cuid()"
            ],
            "list.overflow": [
              {
                "length": 10,
                "hellip": true
              }
            ]
          }
        },
        {
          "type": "String",
          "name": "name",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Name"
            ],
            "searchable": true,
            "field.text": [
              {
                "required": true
              }
            ],
            "is.required": [
              "Required"
            ],
            "is.notempty": [
              "Cannot be empty"
            ],
            "list.text": true,
            "view.text": true
          }
        },
        {
          "type": "String",
          "name": "image",
          "required": false,
          "multiple": false,
          "attributes": {
            "label": [
              "Image"
            ],
            "field.url": true,
            "list.image": [
              20,
              20
            ],
            "view.image": [
              100,
              100
            ]
          }
        },
        {
          "type": "String",
          "name": "type",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Type"
            ],
            "default": [
              "person"
            ],
            "filter.text": true,
            "field.text": [
              {
                "required": true
              }
            ],
            "is.notempty": [
              "Cannot be empty"
            ],
            "list.text": [
              {
                "lower": true
              }
            ],
            "view.text": [
              {
                "lower": true
              }
            ]
          }
        },
        {
          "type": "String",
          "name": "roles",
          "required": true,
          "multiple": true,
          "attributes": {
            "label": [
              "Roles"
            ],
            "field.textlist": [
              {
                "add": "Add Role"
              }
            ],
            "list.hide": true,
            "view.taglist": true
          }
        },
        {
          "type": "String",
          "name": "tags",
          "required": true,
          "multiple": true,
          "attributes": {
            "label": [
              "Tags"
            ],
            "default": [
              "[]"
            ],
            "field.taglist": true,
            "list.hide": true,
            "view.taglist": true
          }
        },
        {
          "type": "Hash",
          "name": "references",
          "required": false,
          "multiple": false,
          "attributes": {
            "label": [
              "References"
            ],
            "default": [
              "{}"
            ],
            "field.metadata": [
              {
                "add": "Add Reference"
              }
            ],
            "list.hide": true,
            "view.metadata": true
          }
        },
        {
          "type": "Boolean",
          "name": "active",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Active"
            ],
            "default": [
              true
            ],
            "active": true,
            "filter.switch": true,
            "list.hide": true,
            "view.yesno": true
          }
        },
        {
          "type": "Datetime",
          "name": "created",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Created"
            ],
            "default": [
              "now()"
            ],
            "sortable": true,
            "span.datetime": true,
            "list.date": [
              "m d, Y h:iA"
            ],
            "view.date": [
              "m d, Y h:iA"
            ]
          }
        },
        {
          "type": "Datetime",
          "name": "updated",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Updated"
            ],
            "default": [
              "now()"
            ],
            "timestamp": true,
            "sortable": true,
            "span.datetime": true,
            "list.date": [
              "m d, Y h:iA"
            ],
            "view.date": [
              "m d, Y h:iA"
            ]
          }
        },
        {
          "type": "Auth",
          "name": "auth",
          "required": false,
          "multiple": false,
          "attributes": {}
        },
        {
          "type": "Application",
          "name": "applications",
          "required": true,
          "multiple": true,
          "attributes": {}
        },
        {
          "type": "Session",
          "name": "sessions",
          "required": true,
          "multiple": true,
          "attributes": {}
        },
        {
          "type": "File",
          "name": "files",
          "required": true,
          "multiple": true,
          "attributes": {}
        },
        {
          "type": "Address",
          "name": "addresses",
          "required": true,
          "multiple": true,
          "attributes": {}
        },
        {
          "type": "Connection",
          "name": "connections",
          "required": true,
          "multiple": true,
          "attributes": {}
        },
        {
          "type": "Connection",
          "name": "memberships",
          "required": true,
          "multiple": true,
          "attributes": {}
        }
      ]
    },
    "Connection": {
      "name": "Connection",
      "mutable": true,
      "attributes": {
        "label": [
          "Connection",
          "Connections"
        ],
        "template": [
          "{{owner.name}} - {{member.name}}"
        ],
        "icon": [
          "users"
        ]
      },
      "columns": [
        {
          "type": "String",
          "name": "ownerId",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Owner"
            ],
            "id": true,
            "field.relation": [
              {
                "href": "/admin/profile/search",
                "key": "owner",
                "foreign": "id",
                "template": "{{name}}"
              }
            ],
            "filter.relation": [
              {
                "href": "/admin/profile/search",
                "key": "owner",
                "foreign": "id",
                "template": "{{name}}"
              }
            ],
            "is.required": true,
            "list.template": [
              {
                "key": "owner",
                "template": "{{name}}"
              }
            ],
            "view.template": [
              {
                "key": "owner",
                "template": "{{name}}"
              }
            ]
          }
        },
        {
          "type": "String",
          "name": "memberId",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Member"
            ],
            "id": true,
            "field.relation": [
              {
                "href": "/admin/profile/search",
                "key": "member",
                "foreign": "id",
                "template": "{{name}}"
              }
            ],
            "filter.relation": [
              {
                "href": "/admin/profile/search",
                "key": "member",
                "foreign": "id",
                "template": "{{name}}"
              }
            ],
            "is.required": true,
            "list.template": [
              {
                "key": "member",
                "template": "{{name}}"
              }
            ],
            "view.template": [
              {
                "key": "member",
                "template": "{{name}}"
              }
            ]
          }
        },
        {
          "type": "String",
          "name": "role",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Role"
            ],
            "default": [
              "member"
            ],
            "field.text": [
              {
                "required": true
              }
            ],
            "filter.text": true
          }
        },
        {
          "type": "String",
          "name": "tags",
          "required": true,
          "multiple": true,
          "attributes": {
            "label": [
              "Tags"
            ],
            "field.taglist": true,
            "list.taglist": true,
            "view.taglist": true
          }
        },
        {
          "type": "Boolean",
          "name": "active",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Active"
            ],
            "default": [
              true
            ],
            "filter.switch": true,
            "list.hide": true,
            "view.yesno": true
          }
        },
        {
          "type": "Datetime",
          "name": "created",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Created"
            ],
            "default": [
              "now()"
            ],
            "sortable": true,
            "list.date": [
              "m d, Y h:iA"
            ],
            "view.date": [
              "m d, Y h:iA"
            ]
          }
        },
        {
          "type": "Datetime",
          "name": "updated",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Updated"
            ],
            "default": [
              "now()"
            ],
            "timestamp": true,
            "sortable": true,
            "list.date": [
              "m d, Y h:iA"
            ],
            "view.date": [
              "m d, Y h:iA"
            ]
          }
        },
        {
          "type": "Profile",
          "name": "owner",
          "required": true,
          "multiple": false,
          "attributes": {
            "relation": [
              {
                "name": "memberships",
                "local": "ownerId",
                "foreign": "id"
              }
            ]
          }
        },
        {
          "type": "Profile",
          "name": "member",
          "required": true,
          "multiple": false,
          "attributes": {
            "relation": [
              {
                "name": "connections",
                "local": "memberId",
                "foreign": "id"
              }
            ]
          }
        }
      ]
    },
    "File": {
      "name": "File",
      "mutable": true,
      "attributes": {
        "label": [
          "File",
          "Files"
        ],
        "template": [
          "{{name}}"
        ],
        "icon": [
          "file"
        ]
      },
      "columns": [
        {
          "type": "String",
          "name": "id",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "ID"
            ],
            "id": true,
            "default": [
              "cuid()"
            ],
            "list.overflow": [
              {
                "length": 10,
                "hellip": true
              }
            ]
          }
        },
        {
          "type": "String",
          "name": "profileId",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Profile"
            ],
            "field.relation": [
              {
                "href": "/admin/profile/search",
                "key": "profile",
                "foreign": "id",
                "template": "{{name}}"
              }
            ],
            "is.required": true,
            "filter.relation": [
              {
                "href": "/admin/profile/search",
                "key": "profile",
                "foreign": "id",
                "template": "{{name}}"
              }
            ],
            "list.template": [
              {
                "key": "profile",
                "template": "{{name}}"
              }
            ],
            "view.template": [
              {
                "key": "profile",
                "template": "{{name}}"
              }
            ]
          }
        },
        {
          "type": "String",
          "name": "name",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Name"
            ],
            "searchable": true,
            "field.text": true,
            "is.required": true,
            "list.text": true,
            "view.text": true
          }
        },
        {
          "type": "String",
          "name": "url",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "URL"
            ],
            "searchable": true,
            "field.url": true,
            "is.required": true,
            "view.link": true
          }
        },
        {
          "type": "String",
          "name": "tags",
          "required": true,
          "multiple": true,
          "attributes": {
            "label": [
              "Tags"
            ],
            "field.taglist": true,
            "view.taglist": true
          }
        },
        {
          "type": "Boolean",
          "name": "active",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Active"
            ],
            "default": [
              true
            ],
            "filter.switch": true,
            "list.hide": true,
            "view.yesno": true
          }
        },
        {
          "type": "Datetime",
          "name": "created",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Created"
            ],
            "default": [
              "now()"
            ],
            "sortable": true,
            "list.date": [
              "m d, Y h:iA"
            ],
            "view.date": [
              "m d, Y h:iA"
            ]
          }
        },
        {
          "type": "Datetime",
          "name": "updated",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Updated"
            ],
            "default": [
              "now()"
            ],
            "timestamp": true,
            "sortable": true,
            "list.date": [
              "m d, Y h:iA"
            ],
            "view.date": [
              "m d, Y h:iA"
            ]
          }
        },
        {
          "type": "Profile",
          "name": "profile",
          "required": true,
          "multiple": false,
          "attributes": {
            "relation": [
              {
                "local": "profileId",
                "foreign": "id"
              }
            ]
          }
        }
      ]
    },
    "Address": {
      "name": "Address",
      "mutable": true,
      "attributes": {
        "label": [
          "Address",
          "Addresses"
        ],
        "template": [
          "{{label}}"
        ],
        "icon": [
          "map-marker"
        ]
      },
      "columns": [
        {
          "type": "String",
          "name": "id",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "ID"
            ],
            "id": true,
            "default": [
              "cuid()"
            ],
            "list.overflow": [
              {
                "length": 10,
                "hellip": true
              }
            ]
          }
        },
        {
          "type": "String",
          "name": "profileId",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Profile"
            ],
            "field.relation": [
              {
                "href": "/admin/profile/search",
                "key": "profile",
                "foreign": "id",
                "template": "{{name}}"
              }
            ],
            "is.required": true,
            "filter.relation": [
              {
                "href": "/admin/profile/search",
                "key": "profile",
                "foreign": "id",
                "template": "{{name}}"
              }
            ],
            "list.template": [
              {
                "key": "profile",
                "template": "{{name}}"
              }
            ],
            "view.template": [
              {
                "key": "profile",
                "template": "{{name}}"
              }
            ]
          }
        },
        {
          "type": "String",
          "name": "label",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Name"
            ],
            "field.text": true,
            "is.required": true,
            "list.text": true,
            "view.text": true
          }
        },
        {
          "type": "String",
          "name": "contact",
          "required": false,
          "multiple": false,
          "attributes": {
            "label": [
              "Contact Person"
            ],
            "field.text": true,
            "list.text": true,
            "view.text": true
          }
        },
        {
          "type": "String",
          "name": "email",
          "required": false,
          "multiple": false,
          "attributes": {
            "label": [
              "Contact Email Address"
            ],
            "field.email": true,
            "is.email": true,
            "view.email": true
          }
        },
        {
          "type": "String",
          "name": "phone",
          "required": false,
          "multiple": false,
          "attributes": {
            "label": [
              "Contact Phone Number"
            ],
            "field.text": true,
            "is.pattern": [
              "/^\\+[0-9]{0,3} [0-9]+$/"
            ],
            "view.phone": true
          }
        },
        {
          "type": "String",
          "name": "unit",
          "required": false,
          "multiple": false,
          "attributes": {
            "label": [
              "Unit Number"
            ],
            "field.text": true,
            "list.text": true,
            "view.text": true
          }
        },
        {
          "type": "String",
          "name": "building",
          "required": false,
          "multiple": false,
          "attributes": {
            "label": [
              "Building Name"
            ],
            "field.text": true,
            "list.text": true,
            "view.text": true
          }
        },
        {
          "type": "String",
          "name": "street",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Street Address"
            ],
            "field.text": true,
            "is.required": true,
            "list.text": true,
            "view.text": true
          }
        },
        {
          "type": "String",
          "name": "neighborhood",
          "required": false,
          "multiple": false,
          "attributes": {
            "label": [
              "Neighborhood"
            ],
            "field.text": true,
            "list.text": true,
            "view.text": true
          }
        },
        {
          "type": "String",
          "name": "city",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "City"
            ],
            "field.text": true,
            "is.required": true,
            "list.text": true,
            "view.text": true
          }
        },
        {
          "type": "String",
          "name": "state",
          "required": false,
          "multiple": false,
          "attributes": {
            "label": [
              "State"
            ],
            "field.text": true,
            "list.text": true,
            "view.text": true
          }
        },
        {
          "type": "String",
          "name": "region",
          "required": false,
          "multiple": false,
          "attributes": {
            "label": [
              "Region"
            ],
            "field.text": true,
            "list.text": true,
            "view.text": true
          }
        },
        {
          "type": "String",
          "name": "country",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Country"
            ],
            "field.country": true,
            "is.required": true,
            "list.text": true,
            "view.text": true
          }
        },
        {
          "type": "String",
          "name": "postal",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Postal Code"
            ],
            "field.text": true,
            "is.required": true,
            "list.text": true,
            "view.text": true
          }
        },
        {
          "type": "String",
          "name": "notes",
          "required": false,
          "multiple": false,
          "attributes": {
            "label": [
              "Notes"
            ],
            "field.textarea": true,
            "view.text": true
          }
        },
        {
          "type": "Float",
          "name": "latitude",
          "required": false,
          "multiple": false,
          "attributes": {
            "label": [
              "Latitude"
            ]
          }
        },
        {
          "type": "Float",
          "name": "longitude",
          "required": false,
          "multiple": false,
          "attributes": {
            "label": [
              "Longitude"
            ]
          }
        },
        {
          "type": "Boolean",
          "name": "active",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Active"
            ],
            "default": [
              true
            ],
            "filter.switch": true,
            "list.hide": true,
            "view.yesno": true
          }
        },
        {
          "type": "Datetime",
          "name": "created",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Created"
            ],
            "default": [
              "now()"
            ],
            "sortable": true,
            "list.date": [
              "m d, Y h:iA"
            ],
            "view.date": [
              "m d, Y h:iA"
            ]
          }
        },
        {
          "type": "Datetime",
          "name": "updated",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Updated"
            ],
            "default": [
              "now()"
            ],
            "timestamp": true,
            "sortable": true,
            "list.date": [
              "m d, Y h:iA"
            ],
            "view.date": [
              "m d, Y h:iA"
            ]
          }
        },
        {
          "type": "Profile",
          "name": "profile",
          "required": true,
          "multiple": false,
          "attributes": {
            "relation": [
              {
                "local": "profileId",
                "foreign": "id"
              }
            ]
          }
        }
      ]
    },
    "Auth": {
      "name": "Auth",
      "mutable": true,
      "attributes": {
        "label": [
          "Auth",
          "Auth"
        ],
        "template": [
          "{{token}}"
        ],
        "icon": [
          "lock"
        ]
      },
      "columns": [
        {
          "type": "String",
          "name": "id",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "ID"
            ],
            "id": true,
            "default": [
              "cuid()"
            ],
            "list.overflow": [
              {
                "length": 10,
                "hellip": true
              }
            ]
          }
        },
        {
          "type": "String",
          "name": "profileId",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Profile"
            ],
            "field.relation": [
              {
                "href": "/admin/profile/search",
                "key": "profile",
                "foreign": "id",
                "template": "{{name}}"
              }
            ],
            "is.required": [
              "Required"
            ],
            "filter.relation": [
              {
                "href": "/admin/profile/search",
                "key": "profile",
                "foreign": "id",
                "template": "{{name}}"
              }
            ],
            "list.template": [
              {
                "key": "profile",
                "template": "{{name}}"
              }
            ],
            "view.template": [
              {
                "key": "profile",
                "template": "{{name}}"
              }
            ]
          }
        },
        {
          "type": "String",
          "name": "type",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Type"
            ],
            "default": [
              "username"
            ],
            "field.text": [
              {
                "required": true
              }
            ],
            "filter.text": true,
            "is.required": [
              "Required"
            ],
            "is.notempty": [
              "Cannot be empty"
            ],
            "list.text": true,
            "view.text": true
          }
        },
        {
          "type": "String",
          "name": "token",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Token"
            ],
            "unique": true,
            "encrypted": true,
            "field.text": [
              {
                "required": true
              }
            ],
            "is.required": [
              "Required"
            ],
            "is.cge": [
              5,
              "Must be at least 5 characters"
            ],
            "list.text": true,
            "view.text": true
          }
        },
        {
          "type": "String",
          "name": "secret",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Secret"
            ],
            "hash": true,
            "field.password": true,
            "is.required": [
              "Required"
            ],
            "is.notempty": [
              "Cannot be empty"
            ],
            "list.hide": true,
            "view.hide": true
          }
        },
        {
          "type": "Boolean",
          "name": "verified",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Verified"
            ],
            "default": [
              false
            ],
            "field.switch": true,
            "filter.switch": true,
            "list.yesno": true,
            "view.yesno": true
          }
        },
        {
          "type": "Datetime",
          "name": "consumed",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Last Used"
            ],
            "default": [
              "now()"
            ],
            "sortable": true,
            "list.date": [
              "m d, Y h:iA"
            ],
            "view.date": [
              "m d, Y h:iA"
            ]
          }
        },
        {
          "type": "Boolean",
          "name": "active",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Active"
            ],
            "default": [
              true
            ],
            "active": true,
            "filter.switch": true,
            "list.hide": true,
            "view.yesno": true
          }
        },
        {
          "type": "Datetime",
          "name": "created",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Created"
            ],
            "default": [
              "now()"
            ],
            "sortable": true,
            "list.date": [
              "m d, Y h:iA"
            ],
            "view.date": [
              "m d, Y h:iA"
            ]
          }
        },
        {
          "type": "Datetime",
          "name": "updated",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Updated"
            ],
            "default": [
              "now()"
            ],
            "timestamp": true,
            "sortable": true,
            "list.date": [
              "m d, Y h:iA"
            ],
            "view.date": [
              "m d, Y h:iA"
            ]
          }
        },
        {
          "type": "Profile",
          "name": "profile",
          "required": true,
          "multiple": false,
          "attributes": {
            "relation": [
              {
                "local": "profileId",
                "foreign": "id"
              }
            ]
          }
        }
      ]
    },
    "Application": {
      "name": "Application",
      "mutable": true,
      "attributes": {
        "label": [
          "App",
          "Apps"
        ],
        "template": [
          "{{name}}"
        ],
        "icon": [
          "laptop"
        ]
      },
      "columns": [
        {
          "type": "String",
          "name": "id",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "ID"
            ],
            "id": true,
            "default": [
              "cuid()"
            ]
          }
        },
        {
          "type": "String",
          "name": "name",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Name"
            ],
            "searchable": true,
            "field.text": [
              {
                "required": true
              }
            ],
            "is.required": [
              "Required"
            ],
            "list.text": true,
            "view.text": true
          }
        },
        {
          "type": "String",
          "name": "logo",
          "required": false,
          "multiple": false,
          "attributes": {
            "label": [
              "Image"
            ],
            "field.url": true,
            "list.image": [
              20,
              20
            ],
            "view.image": [
              100,
              100
            ]
          }
        },
        {
          "type": "String",
          "name": "website",
          "required": false,
          "multiple": false,
          "attributes": {
            "label": [
              "Website"
            ],
            "searchable": true,
            "field.url": true,
            "list.link": [
              {
                "target": "blank"
              }
            ],
            "view.link": [
              {
                "target": "blank"
              }
            ]
          }
        },
        {
          "type": "String",
          "name": "secret",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Secret"
            ],
            "default": [
              "cuid()"
            ],
            "list.hide": true,
            "view.hide": true
          }
        },
        {
          "type": "String",
          "name": "scopes",
          "required": true,
          "multiple": true,
          "attributes": {
            "label": [
              "Scopes"
            ],
            "default": [
              "[]"
            ],
            "field.taglist": true,
            "list.hide": true,
            "view.taglist": true
          }
        },
        {
          "type": "Boolean",
          "name": "active",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Active"
            ],
            "default": [
              true
            ],
            "active": true,
            "filter.switch": true,
            "list.hide": true,
            "view.yesno": true
          }
        },
        {
          "type": "Datetime",
          "name": "expires",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Expires"
            ],
            "sortable": true,
            "field.datetime": true,
            "is.required": [
              "Required"
            ],
            "list.date": [
              "m d, Y h:iA"
            ],
            "view.date": [
              "m d, Y h:iA"
            ]
          }
        },
        {
          "type": "Datetime",
          "name": "created",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Created"
            ],
            "default": [
              "now()"
            ],
            "sortable": true,
            "list.date": [
              "m d, Y h:iA"
            ],
            "view.date": [
              "m d, Y h:iA"
            ]
          }
        },
        {
          "type": "Datetime",
          "name": "updated",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Updated"
            ],
            "default": [
              "now()"
            ],
            "timestamp": true,
            "sortable": true,
            "list.date": [
              "m d, Y h:iA"
            ],
            "view.date": [
              "m d, Y h:iA"
            ]
          }
        },
        {
          "type": "Session",
          "name": "session",
          "required": true,
          "multiple": true,
          "attributes": {}
        },
        {
          "type": "Profile",
          "name": "profile",
          "required": true,
          "multiple": false,
          "attributes": {
            "relation": [
              {
                "local": "profileId",
                "foreign": "id"
              }
            ]
          }
        }
      ]
    },
    "Session": {
      "name": "Session",
      "mutable": true,
      "attributes": {
        "label": [
          "Session",
          "Sessions"
        ],
        "template": [
          "{{profile.name}}"
        ],
        "icon": [
          "coffee"
        ]
      },
      "columns": [
        {
          "type": "String",
          "name": "id",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "ID"
            ],
            "id": true,
            "default": [
              "cuid()"
            ]
          }
        },
        {
          "type": "String",
          "name": "applicationId",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "App"
            ],
            "field.relation": [
              {
                "href": "/admin/app/search",
                "key": "application",
                "foreign": "id",
                "template": "{{name}}"
              }
            ],
            "is.required": [
              "Required"
            ],
            "is.notempty": [
              "Cannot be empty"
            ],
            "filter.relation": [
              {
                "href": "/admin/app/search",
                "key": "application",
                "foreign": "id",
                "template": "{{name}}"
              }
            ],
            "list.template": [
              {
                "key": "application",
                "template": "{{name}}"
              }
            ],
            "view.template": [
              {
                "key": "application",
                "template": "{{name}}"
              }
            ]
          }
        },
        {
          "type": "String",
          "name": "profileId",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Profile"
            ],
            "field.relation": [
              {
                "href": "/admin/profile/search",
                "key": "profile",
                "foreign": "id",
                "template": "{{name}}"
              }
            ],
            "is.required": [
              "Required"
            ],
            "is.notempty": [
              "Cannot be empty"
            ],
            "filter.relation": [
              {
                "href": "/admin/profile/search",
                "key": "profile",
                "foreign": "id",
                "template": "{{name}}"
              }
            ],
            "list.template": [
              {
                "key": "profile",
                "template": "{{name}}"
              }
            ],
            "view.template": [
              {
                "key": "profile",
                "template": "{{name}}"
              }
            ]
          }
        },
        {
          "type": "String",
          "name": "secret",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Secret"
            ],
            "default": [
              "cuid()"
            ],
            "is.notempty": [
              "Cannot be empty"
            ],
            "list.hide": true,
            "view.hide": true
          }
        },
        {
          "type": "String",
          "name": "scopes",
          "required": true,
          "multiple": true,
          "attributes": {
            "label": [
              "Scopes"
            ],
            "default": [
              "[]"
            ],
            "field.taglist": true,
            "list.hide": true,
            "view.taglist": true
          }
        },
        {
          "type": "Boolean",
          "name": "active",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Active"
            ],
            "default": [
              true
            ],
            "active": true,
            "filter.switch": true,
            "list.hide": true,
            "view.yesno": true
          }
        },
        {
          "type": "Datetime",
          "name": "expires",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Expires"
            ],
            "sortable": true,
            "field.datetime": true,
            "is.required": [
              "Required"
            ],
            "is.notempty": [
              "Cannot be empty"
            ],
            "list.date": [
              "m d, Y h:iA"
            ],
            "view.date": [
              "m d, Y h:iA"
            ]
          }
        },
        {
          "type": "Datetime",
          "name": "created",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Created"
            ],
            "default": [
              "now()"
            ],
            "sortable": true,
            "list.date": [
              "m d, Y h:iA"
            ],
            "view.date": [
              "m d, Y h:iA"
            ]
          }
        },
        {
          "type": "Datetime",
          "name": "updated",
          "required": true,
          "multiple": false,
          "attributes": {
            "label": [
              "Updated"
            ],
            "default": [
              "now()"
            ],
            "timestamp": true,
            "sortable": true,
            "list.date": [
              "m d, Y h:iA"
            ],
            "view.date": [
              "m d, Y h:iA"
            ]
          }
        },
        {
          "type": "Application",
          "name": "application",
          "required": true,
          "multiple": false,
          "attributes": {
            "relation": [
              {
                "local": "applicationId",
                "foreign": "id"
              }
            ]
          }
        },
        {
          "type": "Profile",
          "name": "profile",
          "required": true,
          "multiple": false,
          "attributes": {
            "relation": [
              {
                "local": "profileId",
                "foreign": "id"
              }
            ]
          }
        }
      ]
    }
  },
  "plugin": {
    "stackpress/plugins/schema/transform": {},
    "stackpress/plugins/types/transform": {},
    "stackpress/plugins/sql/transform": {},
    "stackpress/plugins/template/transform": {},
    "stackpress/plugins/admin/transform": {}
  }
};

export const registry = new Registry(schema);