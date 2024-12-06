import newDatabase from './database.js'
// import { hash, compare } from 'bcrypt';

// Change this boolean to true if you wish to keep your
// users between restart of your application
const isPersistent = true
const database = newDatabase({isPersistent});

export const getSessionId = (req) => {
  const authorizationHeader = req.headers['authorization'];
  if(!authorizationHeader) {
    return null;
  }
  const sessionId = authorizationHeader.replace('Bearer ', '');
  return sessionId.trim();
};

export { database };

