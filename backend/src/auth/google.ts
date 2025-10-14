import {
    Strategy as GoogleStrategy,
    Profile,
    VerifyCallback
} from 'passport-google-oauth20';
import dotenv from 'dotenv';
import OAuthPlayer from '../models/OAuthPlayer';
dotenv.config();

const options = {
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: `${process.env.BE_BASE_URL}/auth/google/callback`
};

async function verify(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
) {
    try {
        // Check if user exists in our database using Mongoose syntax
        let user = await OAuthPlayer.findOne({
            googleId: profile.id
        });

        // If user doesn't exist, create a new one
        if (!user) {
            user = new OAuthPlayer({
                providerId: profile.id,
                email: profile.emails?.[0]?.value,
                username: profile.displayName || `user_${profile.id}`
            });
            await user.save();
        }

        // Return the user for authentication
        return done(null, user);
    } catch (error) {
        return done(error as Error);
    }
}

export default new GoogleStrategy(options, verify);
