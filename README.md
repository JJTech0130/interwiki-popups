# Interwiki Popups

Adds hover previews (via [Extension:Popups](https://www.mediawiki.org/wiki/Extension:Popups)) for interwiki links pointing to Wikipedia, on wikis where you can't install a custom PHP extension (e.g. Miraheze).

Popups exposes a `mw.popups.register()` function briefly, [then deletes it](https://github.com/wikimedia/mediawiki-extensions-Popups/blob/9b31b9c994809279b045e9bbbfe2c9187267e58a/resources/ext.popups/index.js#L28)|
This script grabs a reference to it the instant it's created, before the deletion happens, and uses it to register a second preview type that only matches interwiki links.

## Supported Interwikis

Currently, only `en.wikipedia.org`. Please submit a PR if you'd like to add support for more wikis.

## Requirements

- [Extension:Popups](https://www.mediawiki.org/wiki/Extension:Popups) installed and enabled
- Ability to run custom Javascript, either through `MediaWiki:Common.js` or [Extension:Gadgets](https://www.mediawiki.org/wiki/Extension:Gadgets)
- JsDelivr and the target wiki allowed via CSP
 
## Installation using [Extension:Gadgets](https://www.mediawiki.org/wiki/Extension:Gadgets)

1. **Create `MediaWiki:Gadget-interwiki-popups.js`** on your wiki, with this content:

   ```js
   mw.loader.load( 'https://cdn.jsdelivr.net/gh/JJTech0130/interwiki-popups@main/interwiki_popups.js' );
   ```

2. **Create `MediaWiki:Gadget-interwiki-popups`** with a short description, e.g.:

   ```
   '''[https://github.com/JJTech0130/interwiki-popups Interwiki Popups]:''' Article previews when hovering over interwiki links to Wikipedia.
   ```

3. **Add a line to `MediaWiki:Gadgets-definition`:**

   ```
   * interwiki-popups[ResourceLoader|type=general]|interwiki-popups.js
   ```

4. Enable it for yourself under `Special:Preferences` -> *Gadgets*, and confirm it's working by hovering an interwiki link like `[[wikipedia:Main Page]]` on a content page. Check your browser console for:

   ```
   [interwiki-popups] registered via captured register()
   ```

5. Once you're happy with it, you can make it load for everyone by default by adding `|default` inside the brackets in step 3:

   ```
   * interwiki-popups[ResourceLoader|type=general|default]|interwiki-popups.js
   ```

### Installation using `MediaWiki:Common.js` or `User:YourUsername/common.js`

Add the following line:
   ```js
   mw.loader.load( 'https://cdn.jsdelivr.net/gh/JJTech0130/interwiki-popups@main/interwiki_popups.js' );
   ```
