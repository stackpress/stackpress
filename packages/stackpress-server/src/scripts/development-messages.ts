//message sent after the child HTTP server starts listening
export const DEVELOPMENT_READY = 'stackpress:development:ready';

//message sent when the child cannot bind or start its HTTP server
export const DEVELOPMENT_ERROR = 'stackpress:development:error';

//message sent by the supervisor to request a graceful child shutdown
export const DEVELOPMENT_SHUTDOWN = 'stackpress:development:shutdown';
