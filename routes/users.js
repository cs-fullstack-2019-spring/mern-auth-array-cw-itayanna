var express = require('express');
var router = express.Router();
var bCrypt = require('bcrypt-nodejs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var userCollection = require('../models/UserSchema');

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    userCollection.findById(id, function(err, user) {
        done(err, user);
    });
});

var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
};

var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

router.get('/', (req, res, next) => {

    if (req.session.username) {
        res.send(req.session.username);
    } else {
        res.send(null);
    }
});


router.get('/logout', (req, res, next) => {
    if (req.session) {
        req.session=null;
        res.send("Logged Out");
    } else {
        res.send("Not logged in");
    }
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        userCollection.findOne({ username: username }, function (err, user) {
            if (err)
            {
                return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!isValidPassword(user, password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user, { user: user.username });
        });
    }
));

router.post('/login',
    passport.authenticate('local',
        {failureRedirect: '/users/loginfail' }),

    function(req, res) {
        req.session.username=req.body.username;
        res.send(req.body.username);
    });


router.get('/loginsuccess', (req, res)=>{
    res.send("Successful Logging in!!!")
});

router.get('/loginfail', (req, res)=>{
    res.send(undefined)
});

passport.use('register', new LocalStrategy(
    {passReqToCallback : true},
    function(req, username, password, done) {
        findOrCreateUser = function(){
            userCollection.findOne({'username':username},function(err, user) {
                if (err){
                    console.log("1");
                    console.log('Error in SignUp: '+err);
                    return done(err);
                }
                if (user) {
                    return done(null, false,
                        { message: 'User already exists.' }
                    );
                } else {
                    var newUser = new userCollection();

                    newUser.username = username;
                    newUser.password = createHash(password);

                    newUser.save(function(err) {
                        if (err){
                            throw err;
                        }
                        return done(null, newUser);
                    });
                }
            });
        };

        process.nextTick(findOrCreateUser);
    })
);

router.post('/newuser',
    passport.authenticate('register',
        { successRedirect: '/users/successNewUser',
            failureRedirect: '/users/failNewUser'
        }
    ),
    function(req, res) {
        res.send('Authenticated!');
    });


router.get('/successNewUser', (req, res)=>{
    res.send("Added New User")
});

router.get('/failNewUser', (req, res)=>{
    res.send("failed to create new user")
});

router.get('/grabook', (req, res)=>{
    console.log(req.session);
    userCollection.findOne({username: req.session.username}, (errors, results)=>{
        if(results){ return res.send(results); }
        else{return res.send({message: "Didn't find a user!!!"})}
    })
});

router.post('/addBook', (req,res)=>{
    userCollection.findOneAndUpdate({username: req.body.username},
        {$push: {book: req.body.book}}, (errors, results)=>{
            if(errors) res.send(errors);
            else res.send("Your book was added");
        });
});



module.exports = router;