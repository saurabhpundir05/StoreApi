//#region imports
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config();
//#endregion

//#region Services

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
interface GooglePayLoad {
  sub: string;
  email: string;
  name: string;
}
export async function verifyGoogleToken(
  idToken: string,
): Promise<GooglePayLoad> {
  const ticket = await client.verifyIdToken({
    idToken,
    //The Google Client ID that the token is intended for.
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  //Extracts the payload from the LoginTicket. This payload contains user info like sub, email, name etc
  const payload = ticket.getPayload();
  if (!payload) throw new Error("Invalid Google Token");
  //! -> non-null assertion means these things exist
  return {
    sub: payload.sub!,
    email: payload.email!,
    name: payload.name!,
  };
}
//#endregion
