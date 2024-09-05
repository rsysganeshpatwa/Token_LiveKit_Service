import { AccessToken } from "livekit-server-sdk";
import { API_KEY, API_SECRET } from "../../config.js";
import WelcomeMap from '../../globalMap.js';

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

export const createToken = async (participantName, roomName, role, adminWelcomeMessage) => {
  const at = new AccessToken(API_KEY, API_SECRET, {
    identity: `${participantName}${generateRandomString(5)}`,
    ttl: 100000,
    name: participantName,
  });
// Add metadata to the token
at.metadata = JSON.stringify({ role: role});
// console.log("admin", role);
if(role=="Role.admin"){
  WelcomeMap.set(roomName, adminWelcomeMessage);
  console.log("admin welcome message added to the map", adminWelcomeMessage);
}

  console.log("participantName", participantName, "role", role);

  // Set permissions based on the role
  let grantOptions = {
    roomJoin: true,
    room: roomName,
    canSubscribe: true,                
  };

  at.addGrant(grantOptions);

  return await at.toJwt();
};
