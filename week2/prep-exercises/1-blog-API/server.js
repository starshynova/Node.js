const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.json());

const dirPath = path.join(__dirname, 'blogs');

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, (err) => {
  if (err)
    throw err;
});
}

function processRequestData(req, res, next) {
  const title = req.body.title;
  const content = req.body.content;

  req.filePath = path.join(dirPath, `${title}.txt`);
  req.title = title;
  req.content = content;

  next(); 
}

app.post('/blogs', processRequestData, (req, res) => {
  const { title, content, filePath } = req;
  fs.writeFile(filePath, content, 'utf8', (err) => {
    if (err) {
      throw err;
  } res.send('You posted your post!')
});
});

app.put('/blogs/:title', processRequestData, (req, res) => {
  const { title, content, filePath } = req;
  if (fs.existsSync(filePath)) {
    fs.writeFile(filePath, content, 'utf8', (err) => {
      if (err) {
        throw err;}
    
    res.send('You edited your post')
  });
  } else {
    res.send('This post does not exist!')
  }
});

app.delete('/blogs/:title', processRequestData, (req, res) => {
  const { title, filePath } = req;

  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        throw err;}
        res.send ('You deleted your post');
    });
     
    } else {
     res.send('This post can not be deleted')
    
  }
});

app.get('/blogs/:title', (req, res) => {
  const title = req.params.title;
  const filePath = path.join(dirPath, `${title}.txt`);
  if (fs.existsSync(filePath)) {
    const post = fs.readFileSync(filePath, 'utf-8');
    res.send(post);
  } else {
    res.send('Server does not have this information')
  }
})

app.get('/blogs', (req, res) => {
  fs.readdir(dirPath, (err, data) => {
    if (err) {
      throw err;
    } res.json(data);
  })
})


app.listen(3000)