const path = require('path');
const Asset = require('parcel-bundler/src/Asset');
const urlJoin = require("parcel-bundler/src/utils/urlJoin");

class AsURLAsset extends Asset {
    constructor(filename, options) {
        super(filename, options);
        this.type = "as-url";
        const { dir, name } = path.parse(filename);
        this.srcName = name;
        this.srcDir = path.relative(options.rootDir, dir);
        this.dst = null;
    };

    // The default `getDependencies` checks to see if this asset has
    // any contents before collecting dependencies - but, as it's
    // entirely virtual, we fail that test.
    async getDependencies() {
        await this.collectDependencies();
    }

    collectDependencies() {
        // The .as-url asset is in the same directory as the target
        // asset. So, just import it as a local dependency. But, the
        // return value of addURLDependency is a relative URL, so we
        // need to make sure that our importers (which can all be in
        // different directories) get something absolute.
        this.dst = urlJoin(
            this.options.publicURL,
            urlJoin(
                this.srcDir,
                this.addURLDependency(path.join(".", this.srcName)),
            ),
        );
    };

    generate() {
        const code = `export default ${JSON.stringify(this.dst)};`;
        return [
            {
                type: "js",
                value: code,
            }
        ];
    };
};

module.exports = AsURLAsset;
