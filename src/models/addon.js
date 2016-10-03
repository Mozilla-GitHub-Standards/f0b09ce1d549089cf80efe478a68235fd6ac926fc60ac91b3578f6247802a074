const rp = require('request-promise-native');
const dbPool = require('./db');

const API_BASE_URL = 'https://addons.mozilla.org/api/v3/';

class Addon{
    constructor(url) {
        this.url = url;
    }

    async getCurrentVersion() {
        let slug = this.url.substring(this.url.slice(0, -1).lastIndexOf('/') + 1);
        var url = `${API_BASE_URL}addons/addon/${slug}`;

        try {
            let amoApiResult = await rp({
                uri: url,
                json: true
            });
            return amoApiResult.current_version.version;
        } catch (err) {
            console.log(err);
            return 'unknown';
        }
    }

    static async getLeastTestedAddon() {
        let result = await dbPool.query(
            `SELECT url
             FROM addons a
             LEFT JOIN (
                SELECT addon_id, COUNT(*) AS cnt
                FROM results
                GROUP BY addon_id) i ON a.id = i.addon_id
                ORDER BY COALESCE(i.cnt, 0), RANDOM()
                LIMIT 1;`
        );
        return result.rows[0].url;
    }
}

module.exports = Addon;
