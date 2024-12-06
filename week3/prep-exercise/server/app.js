import express from 'express';
import { database } from './users.js';
import bcrypt from 'bcrypt';
const saltRounds = 12;
import { v4 as uuidv4 } from 'uuid';
import jsonwebtoken from 'jsonwebtoken';
const SECRET = 'H6AIgu0wsGCH2mC6ypyRubiPoPSpV4t1';
import { getSessionId } from './users.js';

let app = express();
app.use(express.json());

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

  if(!isValidUser(newUser)) {
    res.status(400).send({message: "Invalid user"}).end();
    return;
  } 

  const userExists = database.getByUsername(newUser.username);
  if (userExists) {
    res.status(409).send({message: "User already exists"}).end(); 
    return;
  }

  try {

    newUser.password = await bcrypt.hash(newUser.password, saltRounds);
    const createdUser = database.create(newUser); 
    res.status(201).json({ id: createdUser.id, username: createdUser.username }).end(); 
  } catch (err) {
    console.error(err);
    res.status(500).send({message: "Error creating user"}).end(); 
  }
});
 
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    console.log("Searching for user:", username);
    const findUser = database.getByUsername(username);
    console.log("Found user:", findUser);
  
  if (!findUser) {
    return res.status(404).json({ message: "User not found" });
  }
  
  const correctPassword = await bcrypt.compare(password, findUser.password);

  if(!correctPassword) {
    res.status(401).json({ message: "Invalid username / password combination" }).end();
    return;
  }
  const user = { name: username, id: findUser.id };
  sessions[user.id] = username;
  const token = jsonwebtoken.sign(user, SECRET);
  return res.status(201).json({ token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/auth/profile', async (req, res) => {

  const getDecodedUser = (req) => {
    try {
    const authorizationHeader = req.headers['authorization'];

    if(!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Authorization header failed" })
    }

    const token = authorizationHeader.split(' ')[1];

    return jsonwebtoken.verify(token, SECRET);
    
  } catch (err) {
    res.status(401).json({ message: "Token verification failed"})
  }

  };

  try {
    const decodedUser = getDecodedUser(req);
    
    if (!decodedUser || !decodedUser.id) {
      return res.status(401).json({ message: 'Invalid token' }).end();
    }

    const user = database.getById(decodedUser.id);
    if (!user) {
      return res.status(401).json({ message: 'You are not logged in' });
    }
    const message = `Hello, you are logged in as ${user.username}!`;
    res.status(200).json({ message }).end();
  } catch (err) {
    res.status(401).json({ message: err.message }).end();
  }
});

app.post('/auth/logout', async (req, res) => {

  try {
    req.headers['authorization'] = '';  
    res.status(200).json({ message: "User logged out" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
})


// Serve the front-end application from the `client` folder
app.use(express.static('client'));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

