import newDatabase from './database.js'
import { hash, compare } from 'bcrypt';

// Change this boolean to true if you wish to keep your
// users between restart of your application
const isPersistent = false
const database = newDatabase({isPersistent});

// export const checkPassword = async (username, password) => {
//   const user = database.getByUsername(username);

//   if (!user) {
//     return false; 
//   }

//   const correctPassword = await bcrypt.compare(password, user.password);
//   return correctPassword;
// };

// Create middlewares required for routes defined in app.js
// export const register = async (req, res) => {};

// You can also create helper functions in this file to help you implement logic
// inside middlewares
export { database };

