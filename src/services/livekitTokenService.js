import { AccessToken } from "livekit-server-sdk";
import { API_KEY, API_SECRET } from "../../config.js";

const generateRandomString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const createToken = async (participantName, roomName, role) => {
  const at = new AccessToken(API_KEY, API_SECRET, {
    identity: `${participantName}${generateRandomString(5)}`,
    ttl: 100000,
    name: participantName,
  });

  at.metadata = JSON.stringify({ role });

  console.log("participantName", participantName, "role", role);

  const grantOptions = {
    roomJoin: true,
    room: roomName,
    canSubscribe: true,
  };

  at.addGrant(grantOptions);

  return await at.toJwt();
};
