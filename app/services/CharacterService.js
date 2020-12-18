const fetch = require("node-fetch");
const slug = require("slug");
const {
    DEFAULT_LOCALE
} = require("../constants");

class CharacterService {

    constructor(oauthClient, config) {
        this.oauthClient = oauthClient;
        this.config = config;
    }

    async getCharacter(region, realmName, characterName) {
        const oauthToken = await this.oauthClient.getToken();
        const encodedCharacterName = encodeURIComponent(characterName);
        const realmNameSlug = slug(realmName);
        const host = this.config.apiHosts[region];
        const characterSummaryDocumentURL = `${host}/profile/wow/character/${realmNameSlug}/${encodedCharacterName}`;
        const namespace = this.config.namespaces.profile[region];
        const queryParams = new URLSearchParams({ locale: DEFAULT_LOCALE, namespace })
        const documentUri = `${characterSummaryDocumentURL}?${queryParams}`;
        const headers = { Authorization: `Bearer ${oauthToken}` };
        const response = await fetch(documentUri, { headers });
        if (!response.ok) {
            throw new Error(`${response.status}: ${response.statusText}: ${documentUri}`);
        }
        return response.json();
    }

    async getCharacterMedia(character) {
        const oauthToken = await this.oauthClient.getToken();
        const documentUri = character.media.href;
        const headers = { Authorization: `Bearer ${oauthToken}` };
        const response = await fetch(documentUri, { headers });
        if (!response.ok) {
            throw new Error(`${response.status}: ${response.statusText}: ${documentUri}`);
        }
        const data = await response.json();
        const assetsMap = data.assets.reduce((map, asset) => {
            map[asset.key] = asset.value;
            return map;
        }, {});
        return assetsMap;
    }
}

module.exports = CharacterService;
