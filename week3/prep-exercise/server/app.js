import express from 'express';
import { database } from './users.js';
import { hash, compare } from 'bcrypt';
const saltRounds = 12;
import { v4 as uuidv4 } from 'uuid';
import { checkPassword } from './users.js';
import jsonwebtoken from 'jsonwebtoken';
const SECRET = 'H6AIgu0wsGCH2mC6ypyRubiPoPSpV4t1';




// TODO Use below import statement for importing middlewares from users.js for your routes
// TODO import { ....... } from "./users.js";

let app = express();

app.use(express.json());
// TODO: Create routes here, e.g. app.post("/register", .......)

app.post("/auth/register", async (req, res) => {
  const newUser = { 
    username: req.body.username,
    password: req.body.password
  };
  
  const isValidUser = (user) => {
    if(!user.username || !user.password ) {
      return false;
    }
    return true;
  };

  const hashPassword = async (password) => {
    return await bcrypt.hash(password, saltRounds);
  };

  if(!isValidUser(newUser)) {
    res.status(400).send({message: "Invalid user"}).end();
    return;
  } 

  const userExists = database.getById(newUser.username);
  if (userExists) {
    res.status(409).send({message: "User already exists"}).end(); 
    return;
  }

  try {
    newUser.password = await hashPassword(newUser.password);
    const createdUser = database.create(newUser); 
    res.status(201).json({ id: createdUser.id, username: createdUser.username }).end(); 
  } catch (err) {
    console.error(err);
    res.status(500).send({message: "Error creating user"}).end(); 
  }
 
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
  
  const findUser = database.getByUsername(username);
  
  if (!findUser) {
    return res.status(404).json({ message: "User not found" });
  }
  
  const correctPassword = await bcrypt.compare(password, findUser.password);
  // const validPassword = await checkPassword(username, password);

  if(!correctPassword) {
    res.status(401).json({ message: "Invalid username / password combination" }).end();
    return;
  }
  // res.status(200).json({ message: "Login successful" }).end();
  // } catch (err) {
  //   console.error("Login error:", err);
  //   res.status(500).json({ message: "Internal server error" }).end();
  // }
  // try {
  const user = { name: username, id: findUser.id };
  const token = jsonwebtoken.sign(user, SECRET);
  return res.status(201).json({ token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/auth/profile', async (req, res) => {
  // const sessionId = getSessionId(req);

  const getDecodedUser = (req) => {
    try {
    const authorizationHeader = req.headers['authorization'];
    if(!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Authorization header failed" })
    }

    const token = authorizationHeader.split(' ')[1];

    const decodedUser = jsonwebtoken.verify(token, SECRET);
    if (!decodedUser ||!decodedUser.id) {
      return res.status(401).json({ message: "Invalid token" })
    }
    return decodedUser;
  } catch (err) {
    res.status(401).json({ message: "Token verification failed"})
  }

  };

  try {
    const decodedUser = getDecodedUser(req);
    const username = sessions[decodedUser.id];
    if (!username || !decodedUser.id) {
      return res.status(401).json({ message: 'You are not logged in' }).end();
    }

    const message = `Hello, you are logged in as ${username}!`;
    res.status(200).json({ message }).end();
  } catch (err) {
    res.status(401).json({ message: err.message }).end();
  }
});



    // const sessionId = authorizationHeader.replace('Bearer ', '');
    // return sessionId.trim();
  
  
//   const username = sessions[sessionId];
//   if(!sessionId || !username) {
//     res.status(401).json({ message: 'Not logged in' }).end();
//     return;
//   }

//   const message = `Hello, you are logged in as ${username}!`;
//   res.status(200).json({ message }).end();
// });

})






//   // 3. The password is correct - create a new user session
//   const sessionId = crypto.randomUUID();


//   // 4. Add the new session to the session database
//   sessions[sessionId] = username;


//   // 5. Return the session ID to the client
//   res.status(200).json({ sessionId }).end();
// }); 

})


});









// Serve the front-end application from the `client` folder
app.use(express.static('client'));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
