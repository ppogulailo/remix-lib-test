// app/services/auth.server.ts
import { MicrosoftStrategy } from "remix-auth-microsoft";
import { Authenticator } from "remix-auth";
import { sessionServer } from "~/services/session.server"
// import {a} from "vite-node/dist/index-O2IrwHKf";

interface User{

}

export let authenticator = new Authenticator<User>(sessionServer); //User is a custom user types you can define as you want

let microsoftStrategy = new MicrosoftStrategy(
    {
        clientId: "",
        clientSecret: "",
        redirectUri: "http://localhost:5173/auth/microsoft/callback",
        tenantId: "", // optional - necessary for organization without multitenant (see below)
    },
    async ({ accessToken, extraParams, profile }) => {
        // Here you can fetch the user from database or return a user object based on profile
        // return {profile}
        // The returned object is stored in the session storage you are using by the authenticator

        // If you're using cookieSessionStorage, be aware that cookies have a size limit of 4kb
        // For example this won't work
        // return {accessToken, extraParams, profile}

        // Retrieve or create user using id received from userinfo endpoint
        // https://graph.microsoft.com/oidc/userinfo

        // DO NOT USE EMAIL ADDRESS TO IDENTIFY USERS
        // The email address received from Microsoft Entra ID is not validated and can be changed to anything from Azure Portal.
        // If you use the email address to identify users and allow signing in from any tenant (`tenantId` is not set)
        // it opens up a possibility of spoofing users!

        console.log(profile,accessToken,extraParams)
        return User.findOrCreate({ id: profile.id });
    }
);

authenticator.use(microsoftStrategy);