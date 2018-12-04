const Promise = require("bluebird");
const rp = require("request-promise");
const R = require("ramda");

// Heroku has imageMagick avaialble
const gm = require("gm").subClass({ imageMagick: true });

const express = require("express");
const app = express();

const credentials = {
  client: {
    id: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET
  },
  auth: {
    tokenHost: "https://us.battle.net"
  }
};
const oauth2 = require("simple-oauth2").create(credentials);
let token = null;

const getToken = () => {
  if (token === null || token.expired()) {
    return oauth2.clientCredentials
      .getToken()
      .then(oauth2.accessToken.create)
      .then(t => {
        token = t;
        return t.token.access_token;
      });
  } else {
    return Promise.resolve(token.token.access_token);
  }
};

const getClasses = () => {
  return getToken()
    .then(token => {
      return rp.get({
        uri: `https://us.api.blizzard.com/wow/data/character/classes`,
        json: true,
        qs: {
          locale: "en_US"
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    })
    .then(classes => classes.classes)
    .then(R.map(c => R.objOf(c.id, c.name)))
    .then(R.mergeAll);
};

const getImage = character => {
  return new Promise((resolve, reject) => {
    gm(720, 120)
      .in("-page", "+2+2")
      .in(`https://render-us.worldofwarcraft.com/character/${character.thumbnail.replace("-avatar.jpg", "-inset.jpg")}`)
      .in("-page", "+0+0")
      .in(`./images/background-${character.faction}.png`)
      .mosaic()
      .font("./fonts/merriweather/Merriweather-Bold.ttf")
      .fontSize("30")
      .fill("#deaa00")
      .drawText(220, 40, character.name)
      .font("./fonts/merriweather/Merriweather-Regular.ttf")
      .fontSize("12")
      .fill("#888888")
      .drawText(
        220,
        65,
        `Level ${character.level} ${character.className} ${
          character.guild ? `of <${character.guild.name}> ` : ""
        }on ${character.realm}`
      )
      .drawText(
        220,
        85,
        `Item Level: ${character.items.averageItemLevel} (${
          character.items.averageItemLevelEquipped
        })`
      )
      .drawText(220, 105, `Achievement Points: ${character.achievementPoints}`)
      .toBuffer("PNG", (err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer);
        }
      });
  });
};

const getCharacter = (name, realm) => {
  return getToken().then(token => {
    return rp.get({
      uri: `https://us.api.blizzard.com/wow/character/${realm.toLowerCase()}/${name.toLowerCase()}`,
      json: true,
      qs: {
        fields: "guild,items",
        locale: "en_US"
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  });
};

const getSignature = (name, realm) => {
  return Promise.all([getCharacter(name, realm), getClasses()])
    .spread((character, classes) => {
      return R.assoc("className", classes[character.class], character);
    })
    .then(getImage);
};

app.get("/classes", (req, res) => getClasses().then(res.json.bind(res)));

app.get("/:realm/:name", (req, res) =>
  getSignature(req.params.name, req.params.realm)
    .then(buffer => {
      res.set("Content-Type", "image/png");
      return res.send(buffer);
    })
    .catch(err => {
      res.json(err.message);
    })
);

app.get("/", (req, res) => {
  return getToken()
    .then(res.json.bind(res))
    .catch(err => res.json(err.message));
});

module.exports = app;
