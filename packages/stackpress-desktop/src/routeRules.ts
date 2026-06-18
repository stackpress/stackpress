//client
import type {
  DesktopBlockedRoutesSummary,
  DesktopRouteMethod,
  DesktopRouteRecord,
  DesktopRouteRule
} from './types.js';

//Route metadata sources mirror the Ingest route map shape enough for desktop
// manifest generation to inspect route method and path information.
export type DesktopRouteMetadataSource = {
  routes?: Iterable<[string, {
    method?: string;
    path?: string;
    route?: string;
  }]>;
};

//Route filter results keep allowed routes, blocked routes, and a display-ready
// summary together so build manifests and tests assert the same contract.
export type DesktopRouteFilterResult = {
  allowed: DesktopRouteRecord[];
  blocked: DesktopRouteRecord[];
  blockedSummary: DesktopBlockedRoutesSummary;
};

//Desktop route allowlists accept only the HTTP methods currently supported by
// the generated runtime route guard.
const METHODS = new Set([
  'ALL',
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'OPTIONS'
]);

/**
 * Normalize and validate configured desktop route allowlist rules.
 */
export function normalizeRouteRules(rules: DesktopRouteRule[] = []) {
  return rules.map(rule => {
    //default rules to all methods so simple route entries work as allowlist
    // entries without making app authors repeat the same method literal.
    const method = (rule.method || 'ALL').toUpperCase() as DesktopRouteMethod;

    //reject unsupported methods before any route matching can rely on them
    if (!METHODS.has(method)) {
      throw new Error(`Unsupported desktop route method: ${rule.method}`);
    }

    //desktop routes are always absolute app paths
    if (!rule.route || !rule.route.startsWith('/')) {
      throw new Error(`Desktop route rules must start with "/": ${rule.route}`);
    }

    //wildcards must be a trailing path group, never an inline glob
    if (rule.route.includes('*') && !rule.route.endsWith('/**')) {
      throw new Error(`Desktop route wildcard must be a trailing /** segment: ${rule.route}`);
    }

    //if a wildcard exists, ensure the prefix itself is usable and literal
    if (rule.route.endsWith('/**')) {
      const withoutWildcard = rule.route.slice(0, -3);
      if (!withoutWildcard || withoutWildcard.includes('*')) {
        throw new Error(`Desktop route wildcard must be a trailing /** segment: ${rule.route}`);
      }
    }

    //return the original rule with the canonical method value
    return { ...rule, method };
  });
}

/**
 * Convert a configured or requested route into an absolute path without query.
 */
export function normalizeDesktopRoutePath(route: string) {
  //remove query and hash before allowlist matching
  const path = route.split(/[?#]/, 1)[0] || '/';

  //relative paths are treated as app-root paths
  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Decide whether one request route is allowed by desktop route rules.
 */
export function matchDesktopRoute(
  rules: DesktopRouteRule[] = [],
  route: string,
  method: string = 'GET'
) {
  const normalized = normalizeRouteRules(rules);

  //an empty rule set means the desktop shell exposes all registered routes
  if (!normalized.length) {
    return true;
  }

  //normalize request inputs once before checking each rule
  const requestMethod = method.toUpperCase();
  const path = normalizeDesktopRoutePath(route);

  //a route is allowed when any method-compatible rule matches the path
  return normalized.some(rule => {
    //method-specific rules only match their exact request method
    if (rule.method !== 'ALL' && rule.method !== requestMethod) {
      return false;
    }

    //trailing wildcards match the base path and every descendant path
    if (rule.route.endsWith('/**')) {
      const base = rule.route.slice(0, -3);
      return path === base || path.startsWith(`${base}/`);
    }

    //otherwise exact route equality is required
    return path === rule.route;
  });
}

/**
 * Collect normalized desktop route records from a route metadata source.
 */
export function collectDesktopRoutes(
  source: DesktopRouteMetadataSource
): DesktopRouteRecord[] {
  //without route metadata, callers get an empty route list instead of failure
  if (!source.routes) {
    return [];
  }

  //normalize every route path while preserving its registered method
  return Array.from(source.routes).map(([, route]) => ({
    route: normalizeDesktopRoutePath(route.route || route.path || '/'),
    method: route.method || 'GET'
  }));
}

/**
 * Build a concise summary for routes excluded from the desktop allowlist.
 */
export function summarizeBlockedRoutes(
  routes: DesktopRouteRecord[] = []
): DesktopBlockedRoutesSummary {
  //turn blocked route records into human-readable diagnostics for manifests
  return {
    count: routes.length,
    reasons: routes.map(route => {
      const method = route.method || 'GET';
      return `${method} ${route.route} does not match desktop route allowlist.`;
    })
  };
}

/**
 * Split registered routes into allowed and blocked desktop route buckets.
 */
export function filterDesktopRoutes(
  routes: DesktopRouteRecord[] = [],
  rules: DesktopRouteRule[] = []
): DesktopRouteFilterResult {
  //reduce into stable arrays so allowed and blocked order follows route order
  const result = routes.reduce<DesktopRouteFilterResult>((result, route) => {
    //each route is matched using its registered method or GET by default
    const target = matchDesktopRoute(rules, route.route, route.method || 'GET')
      ? result.allowed
      : result.blocked;
    target.push(route);
    return result;
  }, { allowed: [], blocked: [], blockedSummary: { count: 0, reasons: [] } });

  //derive the summary after all blocked routes are known
  result.blockedSummary = summarizeBlockedRoutes(result.blocked);
  return result;
}
