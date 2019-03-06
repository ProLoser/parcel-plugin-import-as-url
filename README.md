'Import' assets as an URL pointing to the asset.

# Example

First, install Parcel and this plugin the usual way.

In `worker.js`:

```js
postMessage("Hi!");
/* do stuff */
```

In `main.js`:

```js
import workerURL from "worker.js.as-url";

const worker = new Worker(workerURL);
/* do stuff */
```

Then run Parcel with a single entry point of `main.js`.

`worker.js` will have its dependencies bundled in, Babel run on it,
and all the other processing of JavaScript that you'd expect, but
it'll wind up in a separate file.

You also need to have a dummy `worker.js.as-url` file or else Parcel
gets annoyed, but it can be empty - it's totally ignored.

This also works for, e.g., setting `window.location`, or using the
`tabs.executeScript` WebExtension API. In fact, you can import *any*
type of file as an URL just by adding an extra `as-url` extension to
the filename.

# Why?

Parcel comes with autodetection for some specific constructs where
JavaScript needs to reference something by URL, but it's not complete.
If you're using a lesser-used API or you're doing something that
presents difficulties for static analysis (e.g., to pick an example
not at random, while creating a WebExtension), Parcel probably won't
be able to work its magic.

With this plugin, I was able to go from having many entry points that
were redundant and brittle (no static assurance I wouldn't be changing
a filename in one place but not another) to declaratively specifying
these types of dependencies on URLs and, in the end, coming down to
just one entry point with everything else discoverable from there.

See Parcel issues
[#661](https://github.com/parcel-bundler/parcel/issues/661) and
[#2306](https://github.com/parcel-bundler/parcel/issues/2306) for some
more context.

Really, this plugin is a hack - but it's a hack with quite some wheels
on it. Perhaps in the future it won't be needed as Parcel's rough
edges get progressively sanded down, but it does the job today.

# A note on Parcel

Parcel's pretty great. That this plugin is possible (and easy! Go look
at the code and how little of it there is) says to me that its
internal design is fundamentally Right, and it's operating with the
correct abstractions for a bundler.

# License

This package is licensed under the Apache License, version 2.0.
