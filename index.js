require('dotenv').config()
const express = require('express')
const app = express()
const ejsLayouts = require('express-ejs-layouts')
const session = require('express-session')
const passport = require('./config/ppConfig')
const flash = require('connect-flash')
const isLoggedIn = require('./middleware/isLoggedIn')
const methodOverride = require('method-override')
const axios = require('axios')
const db = require('./models')

app.use('/static', express.static('public'))
// views (ejs and layouts) set up
app.set('view engine', 'ejs')
app.use(ejsLayouts)

// body parser middelware
app.use(express.urlencoded({extended:false}))

// session middleware
app.use(session({
    secret: process.env.SUPER_SECRET_SECRET,
    resave: false,
    saveUninitialized: true
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

//overide http methods
app.use(methodOverride('_method'))

// flash middleware (must go AFTER session middleware)
app.use(flash())

// custom middleware
// current user information is generated here and pushed through
// the rest of the routes
app.use((req, res, next) => {
    // before every route, attach the flash messages and current user to res.locals
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next()
})

// controllers middleware 
app.use('/auth', require('./controllers/auth'))
app.use('/journal', require('./controllers/journal'))
app.use('/streams', require('./controllers/streams'))
app.use('/profile', require('./controllers/profile'))
app.use('/home', require('./controllers/home'))

// entry point, only allows log in
app.get('/', (req, res) => {
    res.render('auth/login')
})

//activate the server
app.listen(process.env.PORT || 3000, () => {
    console.log("Pescador running on port 3000")
})
    