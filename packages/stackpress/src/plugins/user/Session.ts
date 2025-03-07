//modules
import type { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
//stackpress
import type Request from '@stackpress/ingest/dist/Request';
import type Response from '@stackpress/ingest/dist/Response';
import Exception from '../../Exception';
//local
import type { Route, Permission, PermissionList, SessionData } from './types';

const isRegExp = /^\/.+\/[igmsuy]*$/

/**
 * Used to get session data from tokens and check permissions
 */
export default class Session {
  //this is the permission list for all roles
  public readonly access: PermissionList;
  //the session name to put in the cookie
  public readonly name: string;
  //the seed to sign the token
  public readonly seed: string;
  //when the token expires
  protected _expires = 0;

  public set expires(value: number) {
    this._expires = value;
  }

  /**
   * Need seed to verify tokens and access for roles 
   */
  public constructor(name: string, seed: string, access: PermissionList) {
    this.name = name;
    this.seed = seed;
    this.access = Object.freeze(access);
  }

  /**
   * Authorizes a request, to be used with api handlers
   */
  public authorize(
    req: Request, 
    res: Response, 
    permits: Permission[] = []
  ) {
    const token = this.token(req);
    const permissions = this.permits(token || '');
    permits.unshift({ method: req.method.toUpperCase(), route: req.url.pathname });
    
    if (token) {
      const session = this.get(token);
      //if no session
      if (!session) {
        res.setError(
          Exception
            .for('Unauthorized')
            .withCode(401)
            .toResponse()
        );
        return false;
      }

      if (!this.can(token, ...permits)) {
        res.setError(
          Exception
            .for('Unauthorized')
            .withCode(401)
            .toResponse()
        );
        return false;
      }

      res.setResults({ ...session, token, permissions });
      return true;
    }

    if (!this.can('', ...permits)) {
      res.setError(
        Exception
          .for('Unauthorized')
          .withCode(401)
          .toResponse()
      );
      return false;
    }
    
    res.setResults({ id: 0, roles: [ 'GUEST' ], token, permissions });
    return true;
  }

  /**
   * Returns true if a token has the required permissions
   */
  public can(token: string, ...permits: Permission[]) {
    //if there are no permits, then we are good
    if (permits.length === 0) {
      return true;
    }
    //get the permissions of the token
    const permissions = this.permits(token);
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
        ? this._matchAnyEvent(permit, events)
        : this._matchAnyRoute(permit, routes)
    );
  }

  /**
   * Creates a new session token
   */
  public create(data: SessionData) {
    if (!this._expires) {
      return jwt.sign(data, this.seed);  
    }
    return jwt.sign(data, this.seed, {
      expiresIn: this._expires
    });
  }

  /**
   * Gets token from request authorization header
   */
  public token(req: Request) {
    if (req.session.has(this.name)) {
      return req.session(this.name) as string;
    }
    return null;
  }

  /**
   * Get session data from token
   */
  public get(token: string): SessionData|null {
    if (!token?.length) {
      return null;
    }
    let response: JwtPayload|string;
    try {
      response = jwt.verify(token, this.seed);
    } catch (error) {
      return null;
    }

    return typeof response === 'string' 
      ? JSON.parse(response)
      : response;
  }

  /**
   * Returns a list of permissions for a token
   */
  public permits(token: string) {
    const session = this.get(token);
    const roles: string[] = session?.roles || [ 'GUEST' ];
    return roles.map(
      //ie. [ ['GUEST', 'USER'], ['USER', 'ADMIN'] ]
      role => this.access[role] || []
    ).flat().filter(
      //unique
      (value, index, self) => self.indexOf(value) === index
    );
  }

  /**
   * Returns true if the permit matches 
   * any of the permission patterns
   */
  protected _matchAnyEvent(permit: string, permissions: string[]) {
    //do the obvious match
    if (permissions.includes(permit)) {
      return true;
    }
    //loop through permissions
    for (const permission of permissions) {
      //we just need one to match to 
      //say that this permit is valid
      if (this._matchEvent(permit, permission)) {
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
  protected _matchAnyRoute(permit: Route, permissions: Route[]) {
    //loop through permissions
    for (const permission of permissions) {
      //we just need one to match to 
      //say that this permit is valid
      if (this._matchRoute(permit, permission)) {
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
  protected _matchEvent(permit: string, permission: string) {
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
  protected _matchRoute(permit: Route, permission: Route) {
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
};