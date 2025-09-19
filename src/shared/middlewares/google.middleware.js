import passport from "passport";

export const googleAuthenticate = passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
});

export const googleCallbackAuth = passport.authenticate('google', {
    failureRedirect: '/auth/login'
});
