const { NAMESPACE_STATIC_US } = require("../constants");
const rp = require("request-promise");
const R = require("ramda");

class ClassesService {

    constructor(oauthClient) {
        this.oauthClient = oauthClient;
        this.idToNameMap = null;
    }

    async getIdToNameMap() {
        if (this.classes) {
            return this.classes;
        }
        await this.buildCache();
        return this.idToNameMap;
    }

    async buildCache() {
        const classesIndex = await this.getClassesIndex();
        this.idToNameMap = R.mergeAll(
            R.map(c => R.objOf(c.id, c.name), classesIndex.classes)
        );
    }

    async getClassesIndex() {
        const oauthToken = await this.oauthClient.getToken();
        const response = await rp.get({
            uri: "https://us.api.blizzard.com/data/wow/playable-class/index",
            json: true,
            qs: {
                locale: "en_US",
                namespace: NAMESPACE_STATIC_US
            },
            headers: {
                Authorization: `Bearer ${oauthToken}`
            }
        });
        return response;
    }
}

module.exports = ClassesService;
