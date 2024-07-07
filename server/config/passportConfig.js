const  GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://homestay-server.vercel.app/api/auth/google/callback",
    scope:['profile','email'],
  },
  function(accessToken, refreshToken, profile, done) {
      try{
        done(null,profile);
      }catch(err){
        done(err,null)
      }
    })
  );
