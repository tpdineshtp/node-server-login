const express = require('express')
const mongoose = require('mongoose')
const http = require('http')
const passport = require('passport')
const session = require('express-session')
const cors = require('cors')
const socketio = require('socket.io')
const morgan = require('morgan');
const { Strategy: TwitterStrategy } = require('passport-twitter')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/trio', { useCreateIndex: true, useNewUrlParser: true })
  .then(() =>  console.log('\x1b[36m%s\x1b[0m', 'Connection successfully established with MongoDB'))
  .catch((err) => console.error(err));

require('./models/userModel');

const TWITTER_CONFIG = {
  consumerKey: '3KRQGXz73icEPYe1rHNHXyrRj',
  consumerSecret: 'za8qZQSa7A0mPPo83Y8siOuev6sAqXEzxF8dvub2icMgK6kviw',
  callbackURL: 'http://127.0.0.1:8080/twitter/callback'
}

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.json())
app.use(passport.initialize())
app.use(morgan('tiny'))

app.use(cors()) 

app.use(session({ 
  secret: 'KeyboardKittens', 
  resave: true, 
  saveUninitialized: true 
}))

passport.serializeUser((user, cb) => cb(null, user))
passport.deserializeUser((obj, cb) => cb(null, obj))

passport.use(new TwitterStrategy(
  TWITTER_CONFIG, 
  (accessToken, refreshToken, profile, cb) => {

    const user = { 
        name: profile.username,
        photo: profile.photos[0].value.replace(/_normal/, '')
    }
    cb(null, user)
  })
)

const twitterAuth = passport.authenticate('twitter')

const addSocketIdToSession = (req, res, next) => {
  req.session.socketId = req.query.socketId
  next()
}

app.get('/twitter', addSocketIdToSession, twitterAuth)

app.get('/twitter/callback', twitterAuth, (req, res) => {
  console.log(req.session)
  io.in(req.session.socketId).emit('user', req.user)
  res.end()
})

var userRouter = require('./routes/user');
app.use('/user', userRouter);

server.listen(8080, () => {
  console.log('\x1b[36m%s\x1b[0m', 'Server started on port 8080');
})