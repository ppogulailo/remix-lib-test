// app/services/auth.server.ts
import { MicrosoftStrategy } from "remix-auth-microsoft";
import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";

interface User{}

export const authenticator = new Authenticator<User>(sessionStorage); //User is a custom user types you can define as you want

const microsoftStrategy = new MicrosoftStrategy(
    {
        clientId: "",
        clientSecret: "",
        redirectUri: "",
        tenantId: "",
        scope: "openid profile email", // optional
        prompt: "login", // optional
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

        console.log(accessToken,extraParams, profile)
        return {profile}
    }
);

authenticator.use(microsoftStrategy);