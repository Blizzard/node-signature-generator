const fetch = require("node-fetch");
const tmp = require("tmp");
const fs = require("fs");
const slug = require("slug");
const {
  BACKGROUND_IMAGE_EMPTY_PATH,
  BACKGROUND_IMAGE_ALLIANCE_PATH,
  BACKGROUND_IMAGE_HORDE_PATH,
  BACKGROUND_IMAGE_NEUTRAL_PATH,
  FONT_MERRIWEATHER_BOLD_PATH,
  FONT_MERRIWEATHER_REGULAR_PATH
} = require("../constants");

/**
 * imageMagick made available by running application in Docker
 */
const gm = require("gm").subClass({ imageMagick: true });

class SignatureService {

  /**
   * Downloads the characters media asset, save the file to disk, and returns
   * the saved filename.
   * @param {string} mediaUrl The URL to the file to download.
   * @returns {string}
   */
  async downloadCharacterMediaAsset(mediaUrl) {
    const tmpName = `${tmp.tmpNameSync()}.png`;
    const response = await fetch(mediaUrl);
    await new Promise((resolve, reject) => {
      const fileWriteStream = fs.createWriteStream(tmpName);
      response.body.pipe(fileWriteStream)
        .on("finish", () => {
          resolve(tmpName);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
    return tmpName;
  }

  getBackgroundImagePath(factionEnum) {
    return factionEnum === "ALLIANCE"
      ? BACKGROUND_IMAGE_ALLIANCE_PATH
      : factionEnum === "HORDE"
        ? BACKGROUND_IMAGE_HORDE_PATH
        : BACKGROUND_IMAGE_NEUTRAL_PATH;
  }

  buildInfoString(character) {
    return `Level ${character.level} ${character.character_class.name} ${
      character.guild ? `of <${character.guild.name}> ` : ""
      }on ${character.realm.name}`;
  }

  async generateImage(character, characterMedia) {
    const { faction } = character;
    const { inset: bustUrl } = characterMedia;
    const backgroundImage = this.getBackgroundImagePath(faction.type);
    const tmpBustPath = await this.downloadCharacterMediaAsset(bustUrl);
    const identityString = this.buildInfoString(character);
    const itemLevelString = `Item Level: ${character.equipped_item_level} (${character.average_item_level})`;
    const achievementPointsString = `Achievement Points: ${character.achievement_points}`;

    return new Promise((resolve, reject) => {
      gm(BACKGROUND_IMAGE_EMPTY_PATH)
        .in("-page", "+2+2")
        .in(tmpBustPath)
        .in("-page", "+0+0")
        .in(backgroundImage)
        .mosaic()
        .font(FONT_MERRIWEATHER_BOLD_PATH)
        .fontSize("30")
        .fill("#deaa00")
        .drawText(220, 40, character.name)
        .font(FONT_MERRIWEATHER_REGULAR_PATH)
        .fontSize("12")
        .fill("#888888")
        .drawText(
          220,
          65,
          identityString
        )
        .drawText(
          220,
          85,
          itemLevelString
        )
        .drawText(
          220,
          105,
          achievementPointsString
        )
        .toBuffer("PNG", (err, buffer) => {
          fs.unlinkSync(tmpBustPath);
          if (err) {
            reject(err);
          } else {
            resolve({
              filename: `${slug(character.name)}-${character.realm.slug}.png`.toLowerCase(),
              data: buffer
            });
          }
        });
    });
  }
}

module.exports = SignatureService;
