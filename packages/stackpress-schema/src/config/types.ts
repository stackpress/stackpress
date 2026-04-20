//stackpress/schema
import type { AttributeDataAssertion } from '../types.js';

export const assertions: Record<string, AttributeDataAssertion> = {
  String: {
    "name": "string",
    "message": "Must be a string."
  },
  Text: {
    "name": "string",
    "message": "Must be a string."
  },
  Number: {
    "name": "number",
    "message": "Must be a number."
  },
  Integer: {
    "name": "integer",
    "message": "Must be a valid integer format."
  },
  Float: {
    "name": "float",
    "message": "Must be a valid float number."
  },
  Boolean: {
    "name": "boolean",
    "message": "Must be a boolean."
  },
  Date: {
    "name": "date",
    "message": "Must be a valid date."
  },
  Datetime: {
    "name": "date",
    "message": "Must be a valid date."
  },
  Time: {
    "name": "date",
    "message": "Must be a valid date."
  },
  Object: {
    "name": "object",
    "message": "Must be an object."
  },
  Hash: {
    "name": "object",
    "message": "Must be an object."
  },
  Json: {
    "name": "object",
    "message": "Must be an object."
  }
};