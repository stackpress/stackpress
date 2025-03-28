//session
import type { 
  SessionRoute,
  SessionTokenData,
  SessionPermission
} from '../../session/types';

/**
 * Client side session interface
 */
export default class Session {
  /**
   * Get session from token
   */
  public static load(data: SessionTokenData) {
    return new Session(data);
  }

  //session token
  public readonly data: SessionTokenData;

  /**
   * Returns true if the session is a guest
   */
  public get guest() {
    return !this.data.id;
  }

  /**
   * Need seed to verify tokens and access for roles 
   */
  public constructor(data: SessionTokenData) {
    this.data = data;
  }

  /**
   * Returns true if a token has the required permissions
   */
  public can(...permits: SessionPermission[]) {
    //if there are no permits, then we are good
    if (permits.length === 0) {
      return true;
    }
    //get the permissions of the token
    const permissions = this.data.permits || [];
    //string permissions are events
    const events = permissions.filter(
      permission => typeof permission === 'string'
    );   
    //object permissions are routes
    const routes = permissions.filter(
      permission => typeof permission !== 'string'
    );
    //every permit must match a permission
    return Array.isArray(permits) && permits.every(
      permit => typeof permit === 'string' 
        ? matchAnyEvent(permit, events)
        : matchAnyRoute(permit, routes)
    );
  }
};

export const isRegExp = /^\/.+\/[igmsuy]*$/;

/**
 * Returns true if the permit matches 
 * any of the permission patterns
 */
export function matchAnyEvent(permit: string, permissions: string[]) {
  //do the obvious match
  if (permissions.includes(permit)) {
    return true;
  }
  //loop through permissions
  for (const permission of permissions) {
    //we just need one to match to 
    //say that this permit is valid
    if (matchEvent(permit, permission)) {
      return true;
    }
  }
  //nothing in the permission list matched
  return false;
}

/**
 * Returns true if the permit matches 
 * any of the permission patterns
 */
export function matchAnyRoute(permit: SessionRoute, permissions: SessionRoute[]) {
  //loop through permissions
  for (const permission of permissions) {
    //we just need one to match to 
    //say that this permit is valid
    if (matchRoute(permit, permission)) {
      return true;
    }
  }
  //nothing in the permission list matched
  return false;
}

/**
 * Returns true if the permit 
 * matches the permission pattern
 */
export function matchEvent(permit: string, permission: string) {
  //do the obvious match
  if (permission === permit) {
    return true;
  }
  //make sure the permit is a regexp string
  const pattern = !isRegExp.test(permission) 
    ? `/^${permission
      //* -> ([^-]+)
      .replaceAll('*', '([^-]+)')
      //** -> ([^-]+)([^-]+) -> (.*)
      .replaceAll('([^-]+)([^-]+)', '(.*)')
    }$/ig` 
    : permission;
  //make permission into a real regexp, 
  //so we can compare against the permit
  const regexp = new RegExp(
    // pattern,
    pattern.substring(
      pattern.indexOf('/') + 1,
      pattern.lastIndexOf('/')
    ),
    // flag
    pattern.substring(
      pattern.lastIndexOf('/') + 1
    )
  );
  //test the permit
  return regexp.test(permit);
}

/**
 * Returns true if the permit 
 * matches the permission pattern
 */
export function matchRoute(permit: SessionRoute, permission: SessionRoute) {
  //if permission is ALL, we dont care what the permit method is
  //permission is not ALL, so if the methods don't match
  if (permission.method !== 'ALL' 
    && permission.method !== permit.method
  ) {
    return false;
  }

  //method checking is now done...

  //do the obvious match
  if (permission.route === permit.route) {
    return true;
  }
  //make sure the permit is a regexp string
  const pattern = !isRegExp.test(permission.route) 
    ? `/^${permission.route
      //replace the :variable-_name01
      .replace(/(\:[a-zA-Z0-9\-_]+)/g, '*')
      //replace the stars
      //* -> ([^/]+)
      .replaceAll('*', '([^/]+)')
      //** -> ([^/]+)([^/]+) -> (.*)
      .replaceAll('([^/]+)([^/]+)', '(.*)')
    }$/ig` 
    : permission.route;
  //make permission into a real regexp, 
  //so we can compare against the permit
  const regexp = new RegExp(
    // pattern,
    pattern.substring(
      pattern.indexOf('/') + 1,
      pattern.lastIndexOf('/')
    ),
    // flag
    pattern.substring(
      pattern.lastIndexOf('/') + 1
    )
  );
  //test the permit
  return regexp.test(permit.route);
}