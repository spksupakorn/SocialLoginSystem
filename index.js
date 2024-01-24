const express = require("express");
const passport = require("passport");
const session = require("express-session");
const path = require('path');
const app = express();
require('./auth');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));

function isLoggedIn(req, res, next) {
    console.log("req_user: ", req.user);
    req.user ? next() : res.sendStatus(401); 
}

app.get('/', (req, res) => {
    res.sendFile ('index.html');
});

app.use(session ({
        secret: 'GmwxscXvrw2Rh3Je',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
}));

app.use(passport.initialize());
app.use(passport.session());
app.get('/auth/google',
    passport.authenticate ('google', {
        scope: ['email', 'profile'],
}));

app.get('/auth/google/callback',
    passport.authenticate ('google', {
        successRedirect: '/auth/protected',
        failureRedirect: '/auth/google/failure',
}));

/* redirect to front end path*/
// app.get('/auth/google/callback', 
//     passport.authenticate('google', { failureRedirect: '/error' }),
//     function(req, res) {
//     // Successful authentication, redirect success.
//     res.redirect('/success');
// });

app.get('/auth/google/failure', (req, res) => {
    res.send('Something went wrong!');
});

app.get('/auth/protected', isLoggedIn, (req, res) => {
    let name = req.user.displayName;
    res.send(`Hello ${name}!`);
});

app.use('/auth/logout', (req, res) => {
    req.session.destroy();
    res.send("See you again!");
})

const PORT = process.env.PORT || 8988;

app.listen (PORT, () => {
    console.log (`Listening on port ${PORT}`);
});