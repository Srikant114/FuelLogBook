import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.model.js";

const setupGooglePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      // verify callback
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName || (email ? email.split("@")[0] : "GoogleUser");
          const photo = profile.photos?.[0]?.value || null;

          if (!email) {
            return done(new Error("No email found in Google profile"), null);
          }

          // find existing user
          let user = await User.findOne({ email });

          if (!user) {
            // create new user (passwordHash left undefined/null for OAuth users)
            user = await User.create({
              name,
              email,
              username: email.split("@")[0] + Math.floor(Math.random() * 9000 + 1000), // ensure unique-ish username
              photoUrl: photo,
            });
          } else {
            // optional: update profile photo/name if changed
            let needSave = false;
            if (user.photoUrl !== photo) { user.photoUrl = photo; needSave = true; }
            if (user.name !== name) { user.name = name; needSave = true; }
            if (needSave) await user.save();
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
};

export default setupGooglePassport;