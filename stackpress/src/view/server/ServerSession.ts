//session
import type { ServerSessionProps, SessionPermission } from '../types';
import { matchAnyEvent, matchAnyRoute } from './helpers';

/**
 * Client side session interface
 */
export default class Session {
  /**
   * Get session from token
   */
  public static load(data: ServerSessionProps) {
    return new Session(data);
  }

  //session token
  public readonly data: ServerSessionProps;

  /**
   * Returns true if the session is a guest
   */
  public get guest() {
    return !this.data.id;
  }

  /**
   * Need seed to verify tokens and access for roles 
   */
  public constructor(data: ServerSessionProps) {
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

