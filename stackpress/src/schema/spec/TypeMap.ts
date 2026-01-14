//stackpress
import Exception from '../../Exception.js';
//schema
import type { SerializerSettings } from '../types.js';
import {
  UnknownSerializer,
  StringSerializer,
  NumberSerializer,
  BooleanSerializer,
  DateSerializer,
  ObjectSerializer
} from './Serializers.js';

export function makeTypeMap<
  S extends Function, 
  U extends Function
>(
  makeSerializer: (settings: SerializerSettings) => {
    serialize: S,
    unserialize: U
  }
) {
  const methods: Record<string, Function> = {};
  const mappings = {
    call(name: string, ...args: unknown[]) {
      const method = methods[name];
      if (method) {
        return method(...args);
      }
      throw Exception.for('Method %s not registered.', name);
    },
    has(name: string) {
      return Boolean(methods[name]);
    },
    make(settings: SerializerSettings) {
      const serializer = makeSerializer(settings);
      return {
        call: mappings.call,
        has: mappings.has,
        register: mappings.register,
        serialize<V>(value: V, seed?: string, scalar = false) {
          return serializer.serialize(value, seed, scalar);
        },
        unserialize<V>(value: V, seed?: string, scalar = false) {
          return serializer.unserialize(value, seed, scalar);
        }
      };
    },
    register(name: string, callback: Function) {
      methods[name] = callback;
    },
    serializer: makeSerializer
  };
  return mappings;
}

export const typemaps = {
  String: makeTypeMap(
    (settings: SerializerSettings) => new StringSerializer(settings)
  ),
  Text: makeTypeMap(
    (settings: SerializerSettings) => new StringSerializer(settings)
  ),
  Number: makeTypeMap(
    (settings: SerializerSettings) => new NumberSerializer(settings)
  ),
  Integer: makeTypeMap(
    (settings: SerializerSettings) => new NumberSerializer(settings)
  ),
  Float: makeTypeMap(
    (settings: SerializerSettings) => new NumberSerializer(settings)
  ),
  Boolean: makeTypeMap(
    (settings: SerializerSettings) => new BooleanSerializer(settings)
  ),
  Date: makeTypeMap(
    (settings: SerializerSettings) => new DateSerializer(settings)
  ),
  Datetime: makeTypeMap(
    (settings: SerializerSettings) => new DateSerializer(settings)
  ),
  Time: makeTypeMap(
    (settings: SerializerSettings) => new DateSerializer(settings)
  ),
  Object: makeTypeMap(
    (settings: SerializerSettings) => new ObjectSerializer(settings)
  ),
  Hash: makeTypeMap(
    (settings: SerializerSettings) => new ObjectSerializer(settings)
  ),
  Json: makeTypeMap(
    (settings: SerializerSettings) => new ObjectSerializer(settings)
  ),
  Unknown: makeTypeMap(
    (settings: SerializerSettings) => new UnknownSerializer(settings)
  )
};

export default typemaps;