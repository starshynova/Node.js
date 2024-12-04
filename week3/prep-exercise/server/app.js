import express from 'express';
import { database } from './users.js';
import { hash, compare } from 'bcrypt';
const saltRounds = 12;
import { v4 as uuidv4 } from 'uuid';


// TODO Use below import statement for importing middlewares from users.js for your routes
// TODO import { ....... } from "./users.js";

let app = express();

app.use(express.json());
// TODO: Create routes here, e.g. app.post("/register", .......)

app.post("/auth/register", async (req, res) => {
  const newUser = { 
    id: uuidv4(),
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
  res.status(201).send({ id: createdUser.id, username: createdUser.username }).end(); 
  } catch (err) {
    console.error(err);
    res.status(500).send({message: "Error creating user"}).end(); 
  }
 
app.post('/auth/login', async (req, res) => {
  
})


});









// Serve the front-end application from the `client` folder
app.use(express.static('client'));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
