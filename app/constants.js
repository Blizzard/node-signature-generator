const path = require("path");

const resourcesPath = path.resolve(__dirname, "../resources/");

const constants = {
    DEFAULT_LOCALE: "en_US",
    BACKGROUND_IMAGE_EMPTY_PATH: path.resolve(resourcesPath, "./images/empty.png"),
    BACKGROUND_IMAGE_ALLIANCE_PATH: path.resolve(resourcesPath, "./images/background-0.png"),
    BACKGROUND_IMAGE_HORDE_PATH: path.resolve(resourcesPath, "./images/background-1.png"),
    BACKGROUND_IMAGE_NEUTRAL_PATH: path.resolve(resourcesPath, "./images/background-2.png"),
    FONT_MERRIWEATHER_BOLD_PATH: path.resolve(resourcesPath, "./fonts/merriweather/Merriweather-Bold.ttf"),
    FONT_MERRIWEATHER_REGULAR_PATH: path.resolve(resourcesPath, "./fonts/merriweather/Merriweather-Regular.ttf"),
};

module.exports = constants;
