const path = require('path');
const Asset = require('parcel-bundler/src/Asset');
const urlJoin = require("parcel-bundler/src/utils/urlJoin");

class AsURLAsset extends Asset {
    constructor(filename, options) {
        super(filename, options);
        this.type = "as-url";
        const { root, dir, name } = path.parse(filename);
        this.srcName = path.relative(
            options.rootDir,
            path.format({ root, dir, name }),
        );
        this.dstName = null;
    };

    // The default `getDependencies` checks to see if this asset has
    // any contents before collecting dependencies - but, as it's
    // entirely virtual, we fail that test.
    async getDependencies() {
        await this.collectDependencies();
    }

    collectDependencies() {
        // The returned path is relative to this.name, but ths script
        // that's importing us might be elsewhere, which could cause
        // havoc. Declare it as an entry (which gives it a well-known
        // URL) and anchor it to the public root to avoid this.
        this.dstName = urlJoin(
            this.options.publicURL,
            this.addURLDependency("~/" + this.srcName, { entry: true }),
        );
    };

    generate() {
        const code = `export default ${JSON.stringify(this.dstName)};`;
        return [
            {
                type: "js",
                value: code,
            }
        ];
    };
};

module.exports = AsURLAsset;
