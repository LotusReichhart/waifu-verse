import passport from 'passport';
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import {appConfig} from "../../../config/app-config.js";
import {serviceLocator} from "../../../app/service-locator.js";

const findUserByEmail = serviceLocator.auth.findUserByEmail;
const createNewUser = serviceLocator.auth.createNewUser;

passport.use(new GoogleStrategy(
    {
        clientID: appConfig.google.clientId,
        clientSecret: appConfig.google.clientSecret,
        callbackURL: "/auth/google/callback",
    },
    async (profile, done) => {
        try {
            const email = profile.emails[0].value;
            let user = await findUserByEmail.execute({email: email});

            if (!user) {
                const base = email.split("@")[0];
                const random = Math.floor(10000 + Math.random() * 90000);
                const username = `${base}${random}`;

                user = await createNewUser.execute({
                    email: email,
                    username: username,
                    name: profile.displayName || username.toUpperCase(),
                    avatar: profile.photos?.[0]?.value,
                });
            }

            return done(null, user);
        } catch (err) {
            console.log('googleStrategy err: ', err);
            return done(err, null);
        }
    }
));

// passport.serializeUser((id, done) => {
//     done(null, id);
// });
//
// passport.deserializeUser(async (id, done) => {
//     try {
//         done(null, id);
//     } catch (err) {
//         console.log('Passport deserializeUser err: ', err);
//         done(err, null);
//     }
// });

