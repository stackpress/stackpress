import type { SchemaConfig } from '@stackpress/idea-parser';
export const config: SchemaConfig = {
  enum: {
    Roles: {
      ADMIN: 'Admin',
      MANAGER: 'Manager',
      USER: 'User'
    }
  },
  model: {
    Profile: {
      name: 'Profile',
      mutable: true,
      attributes: {
        labels: [ 'Profile', 'Profiles' ],
        display: [ '{{name}}' ],
        icon: [ 'user' ]
      },
      columns: [
        {
          type: 'String',
          name: 'id',
          required: true,
          multiple: false,
          attributes: {
            'label': [ 'ID' ],
            'id': true,
            'default': [ 'cuid()' ],
            'list.overflow': [ { length: 10, hellip: true } ]
          }
        },
        {
          type: 'String',
          name: 'name',
          required: true,
          multiple: false,
          attributes: {
            'label': [ 'Name' ],
            'searchable': true,
            'field.text': [ { required: true } ],
            'is.required': [ 'Required' ],
            'is.notempty': [ 'Cannot be empty' ],
            'list.text': true,
            'view.text': true
          }
        },
        {
          type: 'String',
          name: 'image',
          required: false,
          multiple: false,
          attributes: {
            'label': [ 'Image' ],
            'field.url': true,
            'list.image': [ 20, 20 ],
            'view.image': [ 100, 100 ],
          }
        },
        {
          type: 'String',
          name: 'type',
          required: true,
          multiple: false,
          attributes: {
            'label': [ 'Type' ],
            'default': [ 'person' ],
            'filter.text': true,
            'field.text': [ { required: true } ],
            'is.notempty': [ 'Cannot be empty' ],
            'list.text': [ { lower: true } ],
            'view.text': [ { lower: true } ]
          }
        },
        {
          type: 'String',
          name: 'roles',
          required: true,
          multiple: true,
          attributes: {
            'label': [ 'Roles' ],
            'field.textlist': [ { add: 'Add Role' } ],
            'list.hide': true,
            'view.taglist': true
          }
        },
        {
          type: 'String',
          name: 'tags',
          required: true,
          multiple: true,
          attributes: {
            'label': [ 'Tags' ],
            'default': [ '[]' ],
            'field.taglist': true,
            'list.hide': true,
            'view.taglist': true
          }
        },
        {
          type: 'Hash',
          name: 'references',
          required: false,
          multiple: false,
          attributes: {
            'label': [ 'References' ],
            'default': [ '{}' ],
            'field.metadata': [ { add: 'Add Reference' } ],
            'list.hide': true,
            'view.metadata': true
          }
        },
        {
          type: 'Boolean',
          name: 'active',
          required: true,
          multiple: false,
          attributes: {
            'label': [ 'Active' ],
            'default': [
              true
            ],
            'active': true,
            'filter.switch': true,
            'list.hide': true,
            'view.yesno': true
          }
        },
        {
          type: 'Datetime',
          name: 'created',
          required: true,
          multiple: false,
          attributes: {
            'label': [ 'Created' ],
            'default': [ 'now()' ],
            'sortable': true,
            'span.datetime': true,
            'list.date': [ 'm d, Y h:iA' ],
            'view.date': [ 'm d, Y h:iA' ]
          }
        },
        {
          type: 'Datetime',
          name: 'updated',
          required: true,
          multiple: false,
          attributes: {
            'label': [ 'Updated' ],
            'default': [ 'now()' ],
            'timestamp': true,
            'sortable': true,
            'span.datetime': true,
            'list.date': [ 'm d, Y h:iA' ],
            'view.date': [ 'm d, Y h:iA' ]
          }
        },
        {
          type: 'Auth',
          name: 'auth',
          required: false,
          multiple: false,
          attributes: {}
        }
      ]
    },
    Auth: {
      name: 'Auth',
      mutable: true,
      attributes: {
        labels: [ 'Auth', 'Auth' ],
        display: [ '{{token}}' ],
        icon: [ 'lock' ],
        query: [ '*', 'profile.*' ]
      },
      columns: [
        {
          type: 'String',
          name: 'id',
          required: true,
          multiple: false,
          attributes: {
            'label': [ 'ID' ],
            'id': true,
            'default': [ 'cuid()' ],
            'list.overflow': [ { length: 10, hellip: true } ]
          }
        },
        {
          type: 'String',
          name: 'profileId',
          required: true,
          multiple: false,
          attributes: {
            'label': [ 'Profile' ],
            'field.relation': [
              {
                id: 'id',
                search: '/admin/profile/search?json',
                template: '{{name}}'
              }
            ],
            'is.required': [ 'Required' ],
            'is.notempty': [ 'Cannot be empty' ],
            'filter.relation': [
              {
                id: 'id',
                search: '/admin/profile/search?json',
                template: '{{name}}'
              }
            ],
            'list.template': [ { template: '{{profile.name}}' } ],
            'view.template': [ { template: '{{profile.name}}' } ]
          }
        },
        {
          type: 'String',
          name: 'type',
          required: true,
          multiple: false,
          attributes: {
            'label': [ 'Type' ],
            'default': [ 'username' ],
            'field.text': [ { required: true } ],
            'filter.text': true,
            'is.required': [ 'Required' ],
            'is.notempty': [ 'Cannot be empty' ],
            'list.text': true,
            'view.text': true
          }
        },
        {
          type: 'String',
          name: 'token',
          required: true,
          multiple: false,
          attributes: {
            'label': [ 'Token' ],
            'unique': true,
            'encrypted': true,
            'field.text': [ { required: true } ],
            'is.required': [ 'Required' ],
            'is.cge': [ 5, 'Must be at least 5 characters' ],
            'list.text': true,
            'view.text': true
          }
        },
        {
          type: 'String',
          name: 'secret',
          required: true,
          multiple: false,
          attributes: {
            'label': [ 'Secret' ],
            'hash': true,
            'secret': true,
            'field.password': true,
            'is.required': [ 'Required' ],
            'is.notempty': [ 'Cannot be empty' ],
            'list.hide': true,
            'view.hide': true
          }
        },
        {
          type: 'Boolean',
          name: 'verified',
          required: true,
          multiple: false,
          attributes: {
            'label': [ 'Verified' ],
            'default': [ false ],
            'field.switch': true,
            'filter.switch': true,
            'list.yesno': true,
            'view.yesno': true
          }
        },
        {
          type: 'Datetime',
          name: 'consumed',
          required: true,
          multiple: false,
          attributes: {
            'label': [ 'Last Used' ],
            'default': [ 'now()' ],
            'sortable': true,
            'list.date': [ 'm d, Y h:iA' ],
            'view.date': [ 'm d, Y h:iA' ]
          }
        },
        {
          type: 'Boolean',
          name: 'active',
          required: true,
          multiple: false,
          attributes: {
            'label': [ 'Active' ],
            'default': [ true ],
            'active': true,
            'filter.switch': true,
            'list.hide': true,
            'view.yesno': true
          }
        },
        {
          type: 'Datetime',
          name: 'created',
          required: true,
          multiple: false,
          attributes: {
            'label': [ 'Created' ],
            'default': [ 'now()' ],
            'sortable': true,
            'list.date': [ 'm d, Y h:iA' ],
            'view.date': [ 'm d, Y h:iA' ]
          }
        },
        {
          type: 'Datetime',
          name: 'updated',
          required: true,
          multiple: false,
          attributes: {
            'label': [ 'Updated' ],
            'default': [ 'now()' ],
            'timestamp': true,
            'sortable': true,
            'list.date': [ 'm d, Y h:iA' ],
            'view.date': [ 'm d, Y h:iA' ]
          }
        },
        {
          type: 'Profile',
          name: 'profile',
          required: true,
          multiple: false,
          attributes: {
            'relation': [ { local: 'profileId', foreign: 'id' } ]
          }
        }
      ]
    }
  }
};

export default config;