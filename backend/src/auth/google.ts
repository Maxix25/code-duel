import {
    Strategy as GoogleStrategy,
    Profile,
    VerifyCallback
} from 'passport-google-oauth20';
import dotenv from 'dotenv';
import Player from '../models/Player';
dotenv.config();

const options = {
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: `${process.env.BE_BASE_URL}/auth/google/callback`
};

async function verify(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback
) {
    try {
        // Check if user exists in our database using Mongoose syntax
        let user = await Player.findOne({
            'accounts.providerId': profile.id,
            'accounts.provider': 'google'
        });
        if (user) {
            return done(null, user);
        }
        // If user doesn't exist, check if it exists by email (link accounts)
        user = await Player.findOne({ email: profile.emails?.[0]?.value });
        if (user) {
            // Add Google account to existing user
            user.accounts.push({
                provider: 'google',
                providerId: profile.id
            });
            await user.save();
            return done(null, user);
        }
        // If user doesn't exist, create a new one
        // Check if displayName is available, otherwise use email prefix or a default username
        const name = await Player.findOne({ username: profile.displayName });
        if (name) {
            profile.displayName = `user_${profile.id}`;
        }
        if (!user) {
            try {
                user = new Player({
                    email: profile.emails?.[0]?.value,
                    username: profile.displayName || `user_${profile.id}`,
                    accounts: [
                        {
                            provider: 'google',
                            providerId: profile.id
                        }
                    ]
                });
            } catch {
                user = new Player({
                    email: profile.emails?.[0]?.value,
                    username: `user_${profile.id}`,
                    accounts: [
                        {
                            provider: 'google',
                            providerId: profile.id
                        }
                    ]
                });
            }
            await user.save();
        }

        // Return the user for authentication
        return done(null, user);
    } catch (error) {
        return done(error as Error);
    }
}

export default new GoogleStrategy(options, verify);
