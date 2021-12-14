const express = require('express');
const app = express();
const port = 5000;

const config = require('./config/key');

const { User } = require('./models/User');

// application/x-www-form-urlencoded 타입 바디 가져오기
app.use(express.urlencoded({ extended: true }));

// application/json 타입 바디 가져오기
app.use(express.json());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello World! Man!3'));

app.post('/register', (req, res) => {
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });

    return res.status(200).json({
      success: true
    });
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));