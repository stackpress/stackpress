//tests
import { expect } from 'chai';
import { describe, it } from 'mocha';
//src
import { setViewProps } from '../src/helpers.js';

describe('view/helpers', () => {
  it('should serialize notifier options for the client layout', () => {
    const values = new Map<string, unknown>();
    const req = {
      data: {
        has() {
          return false;
        }
      }
    };
    const res = {
      data: {
        set(key: string, value: unknown) {
          values.set(key, value);
        }
      }
    };
    const config = {
      view: {
        base: '/app',
        props: { environment: 'test' },
        notify: {
          position: 'top-right',
          autoClose: 2500,
          theme: 'light'
        }
      },
      brand: {},
      language: {}
    };
    const ctx = {
      config: {
        path(path: string, fallback?: unknown) {
          return path.split('.').reduce<unknown>((value, key) => {
            if (!value || typeof value !== 'object') return undefined;
            return (value as Record<string, unknown>)[key];
          }, config) ?? fallback;
        }
      }
    };

    setViewProps(req as any, res as any, ctx as any);

    expect(values.get('view')).to.deep.equal({
      base: '/app',
      props: { environment: 'test' },
      notify: {
        position: 'top-right',
        autoClose: 2500,
        theme: 'light'
      }
    });
  });

  it('should default missing notifier options to an empty object', () => {
    const values = new Map<string, unknown>();
    const req = { data: { has: () => false } };
    const res = {
      data: {
        set(key: string, value: unknown) {
          values.set(key, value);
        }
      }
    };
    const ctx = {
      config: {
        path(path: string, fallback?: unknown) {
          const config: Record<string, unknown> = {
            view: {},
            brand: {},
            language: {}
          };
          return config[path] ?? fallback;
        }
      }
    };

    setViewProps(req as any, res as any, ctx as any);

    expect(values.get('view')).to.deep.equal({
      base: '/',
      props: {},
      notify: {}
    });
  });
});
