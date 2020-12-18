const express = require("express");
const OauthClient = require("./oauth/client.js");
const CharacterService = require("./services/CharacterService");
const SignatureService = require("./services/SignatureService");

const oauthOptions = {
  client: {
      id: process.env.CLIENT_ID,
      secret: process.env.CLIENT_SECRET
  },
  auth: {
      tokenHost: "https://us.battle.net"
  }
};

const oauthClient = new OauthClient({ oauthOptions });
const characterService = new CharacterService(oauthClient);
const signatureService = new SignatureService();

const app = express();

app.get("/", async (req, res, next) => {
  res.status(404).send("No route found for `/`. Refer to Readme.md for available routes.");
});

app.get("/signature", async (req, res, next) => {
  try {
    const { characterName, realmName } = req.query;
    const character = await characterService.getCharacter(characterName, realmName);
    const characterMedia = await characterService.getCharacterMedia(character);
    const { filename, data } = await signatureService.generateImage(character, characterMedia);
    res.set("Content-Type", "image/png");
    res.set("Content-Disposition", `inline; filename="${filename}"`);
    res.send(data);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Internal Service Error");
});

module.exports = async () => {
  await oauthClient.getToken();
  return app;
};
