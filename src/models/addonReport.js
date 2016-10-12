const dbPool = require('./db');
const Addon = require('./addon.js');

class AddonReport extends Addon {
    constructor(url, is_compatible, comment, session) {
        super(url);
        this.is_compatible = is_compatible;
        this.comment = comment;
        this.session = session;
    }

    async save() {
        let res = await dbPool.query(
            'SELECT id FROM addons WHERE url = $1;', [this.url]
        );
        let result = res.rows[0];
        if (result && result.id) {
            let version = await this.getCurrentVersion();
            dbPool.query(
                `INSERT INTO test.results (addon_id, version, compatible, comment, session)
                 VALUES ($1, $2, $3, $4, $5);`,
                [parseInt(result.id, 10), version, this.is_compatible, this.comment, this.session]
            );
        }
    }
}

module.exports = AddonReport;
