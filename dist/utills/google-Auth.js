"use strict";
// import passport from 'passport';
// import { Request } from 'express';
// import { Strategy, Profile } from 'passport-google-oauth20';
// import dotenv from 'dotenv';
// dotenv.config();
// passport.use(
//     new Strategy(
//         {
//             clientID: process.env.GOOGLE_CLIENT_ID!,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//             callbackURL: `http://${process.env.BASE_URL}/auth/google/callback`,
//             passReqToCallback: true,
//         },
//         async function (request: Request, accessToken: string, refreshToken: string, profile: Profile, done: any) {
//             await findOne({ googleId: profile.id }, function (err: any, user: any) {
//                 return done(err, user);
//             });
//         }
//     )
// );
//# sourceMappingURL=google-Auth.js.map