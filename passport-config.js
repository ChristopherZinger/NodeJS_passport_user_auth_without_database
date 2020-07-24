const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');




function initialize(passport, getUserByEmail, getUserById ) {
    const authenticateUser = async (email, password, done)=>{

        // fing user by email
        const user = getUserByEmail(email);
        console.log('user : ', user);
        console.log('password', password)
        if(user == null){
            return done(null, false, {message: "no user with this email"})
        }

        // verify password
        try {
            if( await bcrypt.compare(password, user.password) ) {
                return done(null, user);
            }else{
                return done(null, false, {message: "password incorrect"});
            }
        } catch (e) {
            return done(e)
        }
    };

    passport.use(
        new LocalStrategy({usernameField : 'email'},
        authenticateUser)
        )
    passport.serializeUser((user,done)=>{ 
        return done(null, user.id)
     }),
    passport.deserializeUser((id, done)=>{ 
        return done(null, getUserById(id))
     })
    
};

module.exports = initialize;