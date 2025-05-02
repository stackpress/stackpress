//modules
import { SignJWT, jwtVerify } from 'jose';
//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
//root
import Exception from '../Exception.js';
//session
import type { 
  SessionData, 
  SessionPermission,
  SessionPermissionList
} from './types.js';
import { matchAnyEvent, matchAnyRoute } from './helpers.js';

/**
 * Used to get session data from tokens and check permissions
 */
export default class SessionServer {
  //this is the permission list for all roles
  protected static _access: SessionPermissionList = {};
  //when the token expires
  protected static _expires = 0;
  //the session key to put in the cookie
  protected static _key = 'session';
  //the seed to sign tokens
  protected static _seed = 'abc123';

  /**
   * Returns the permission list for all roles
   */
  public static get access() {
    return this._access;
  }

  /**
   * Returns the seed to sign tokens
   */
  public static get seed() {
    return this._seed;
  }

  /**
   * Returns the session name used in cookie
   */
  public static get key() {
    return this._key;
  }

  /**
   * Sets the token expiry time
   */
  public static set expires(value: number) {
    this._expires = value;
  }

  /**
   * Authorizes a request, to be used with api handlers
   * Usage: if (!registry.authorize(req, res)) return;
   */
  public static async authorize(
    req: Request, 
    res: Response, 
    permits: SessionPermission[] = []
  ) {
    //if no access list, then white list all
    if (Object.keys(this._access).length === 0) {
      return true;
    }
    //get session
    const session = this.load(req);
    //add the current request to the permits in question
    permits.unshift({ 
      method: req.method.toUpperCase(), 
      route: req.url.pathname 
    });

    if (!session.can(...permits)) {
      res.setError(
        Exception
          .for('Unauthorized')
          .withCode(401)
          .toResponse()
      );
      return false;
    }

    res.setResults(await session.authorization());
    return true;
  }

  /**
   * Need seed to verify tokens and access for roles 
   */
  public static configure(
    key: string, 
    seed: string, 
    access: SessionPermissionList
  ) {
    this._key = key;
    this._seed = seed;
    this._access = access;
    return this;
  }

  /**
   * Creates a new session token
   */
  public static async create(data: SessionData) {
    const seed = new TextEncoder().encode(this.seed);
    const signer = new SignJWT(data)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt();
    if (!this._expires) {
      return await signer.sign(seed);  
    }
    return await signer.setExpirationTime(this._expires).sign(seed);
  }

  /**
   * Gets token from request authorization header
   */
  public static token(req: Request) {
    if (req.session.has(this.key)) {
      return req.session(this.key) as string;
    }
    return null;
  }

  /**
   * Get session from token
   */
  public static load(token: string|Request) {
    if (typeof token === 'string') {
      return new SessionServer(token);
    }
    return new SessionServer(this.token(token) || '');
  }

  //session token
  public readonly token: string;
  //Session data cache
  protected _data?: SessionData|null;
  
  /**
   * Need seed to verify tokens and access for roles 
   */
  public constructor(token: string) {
    this.token = token;
  }

  public async authorization() {
    const data = await this.data();
    return { 
      id: 0, 
      roles: [ 'GUEST' ], 
      ...(data || {}),
      token: this.token, 
      permits: await this.permits()
    };
  }

  /**
   * Returns the session data from jwt token
   */
  public async data() {
    if (typeof this._data === 'undefined') {
      this._data = null;
      if (this.token.length) {
        const seed = new TextEncoder().encode(SessionServer.seed);
        try {
          const { payload } = await jwtVerify(this.token, seed);
          this._data = typeof payload === 'string' 
            ? JSON.parse(payload) as SessionData
            : payload as SessionData;
        } catch (e) {}
      }
    }
    return this._data;
  }

  /**
   * Returns true if the session is a guest
   */
  public async guest() {
    const data = await this.data();
    return data === null;
  }

  /**
   * Returns true if a token has the required permissions
   */
  public async can(...permits: SessionPermission[]) {
    //if there are no permits, then we are good
    if (permits.length === 0) {
      return true;
    }
    //get the permissions of the token
    const permissions = await this.permits();
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

  /**
   * Returns a list of permissions for a token
   */
  public async permits() {
    const data = await this.data();
    const roles: string[] = data?.roles || [ 'GUEST' ];
    return roles.map(
      //ie. [ ['GUEST', 'USER'], ['USER', 'ADMIN'] ]
      role => SessionServer.access[role] || []
    ).flat().filter(
      //unique
      (value, index, self) => self.indexOf(value) === index
    );
  }
  
  /**
   * Saves the active locale to the session
   */
  public save(res: Response) {
    res.session.set(SessionServer.key, this.token);
    return this;
  }
};