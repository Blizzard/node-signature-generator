const rp = require("request-promise");
const slug = require("slug");
const {
    NAMESPACE_PROFILE_US,
    DEFAULT_LOCALE
} = require("../constants");

class CharacterService {

    constructor(oauthClient) {
        this.oauthClient = oauthClient;
    }

    async getCharacter(characterName, realmName) {
        const oauthToken = await this.oauthClient.getToken();
        const encodedCharacterName = encodeURIComponent(characterName);
        const realmNameSlug = slug(realmName);
        const characterSummaryDocumentURL = `https://us.api.blizzard.com/profile/wow/character/${realmNameSlug}/${encodedCharacterName}`;
        const response = await rp.get({
            uri: characterSummaryDocumentURL,
            json: true,
            qs: {
                locale: DEFAULT_LOCALE,
                namespace: NAMESPACE_PROFILE_US
            },
            headers: {
                Authorization: `Bearer ${oauthToken}`
            }
        });
        return response;
    }

    async getCharacterMedia(character) {
        const oauthToken = await this.oauthClient.getToken();
        const characterMediaDocumentURL = character.media.href;
        const response = await rp.get({
            uri: characterMediaDocumentURL,
            json: true,
            headers: {
                Authorization: `Bearer ${oauthToken}`
            }
        });
        const assetsMap = response.assets.reduce((map, asset) => {
            map[asset.key] = asset.value;
            return map;
        }, {});
        return assetsMap;
    }
}

module.exports = CharacterService;
