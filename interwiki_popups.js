( function () {
	'use strict';

	var SELECTOR = '#mw-content-text a.extiw[href*="en.wikipedia.org/wiki/"]';
	var capturedRegister = null;
	var backingValue;

	if ( Object.prototype.hasOwnProperty.call( mw, 'popups' ) ) {
		// mw.popups was already created before our script ran,
		// meaning it probably won't work, because of the intentional delete of popups.register()
		mw.log.warn( '[interwiki-popups] unable to hook mw.popups, bailing!' );
		return;
	}

	Object.defineProperty( mw, 'popups', {
		configurable: true,
		enumerable: true,
		get: function () {
			return backingValue;
		},
		set: function ( value ) {
			backingValue = value;

			if ( value && typeof value.register === 'function' ) {
				capturedRegister = value.register;
				registerInterwikiType();
			}

			// revert everything to how it was
			Object.defineProperty( mw, 'popups', {
				value: value,
				writable: true,
				configurable: true,
				enumerable: true
			} );
		}
	} );

	function registerInterwikiType() {
		capturedRegister.call( mw.popups, {
			type: 'wikipedia-interwiki',
			selector: SELECTOR,
			gateway: {
				fetchPreviewForTitle: function ( title ) {
					var pageTitle = title.getPrefixedDb();
					var controller = new AbortController();
					// this is the Wikipedia REST API, if you're adapting this to other wikis this might not work
					var promise = $.ajax( {
						url: 'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent( pageTitle ),
						headers: {
							Accept: 'application/json; charset=utf-8; profile="https://www.mediawiki.org/wiki/Specs/Summary/1.2.0"'
						},
						signal: controller.signal
					} ).then( function ( page ) {
						return {
							title: page.title,
							url: ( page.content_urls && page.content_urls.desktop ) ?
								page.content_urls.desktop.page :
								'https://en.wikipedia.org/wiki/' + encodeURIComponent( pageTitle ),
							languageCode: page.lang || 'en',
							languageDirection: page.dir || 'ltr',
							extract: page.extract_html || page.extract || '',
							type: 'page',
							thumbnail: page.thumbnail,
							pageId: page.pageid
						};
					} );
					promise.abort = function () { controller.abort(); };
					return promise;
				}
			}
		} );
		mw.log( '[interwiki-popups] registered via captured register()' );
	}

	// hostname check requires external links to be tagged with data-title
	function extractTitleFromHref( href ) {
		var m = /\/wiki\/([^?#]+)/.exec( href );
		return m ? decodeURIComponent( m[ 1 ].replace( /_/g, ' ' ) ) : null;
	}
	function tagInterwikiLinks( root ) {
		( root || document ).querySelectorAll( SELECTOR ).forEach( function ( el ) {
			if ( !el.dataset.title ) {
				var t = extractTitleFromHref( el.getAttribute( 'href' ) );
				if ( t ) { el.dataset.title = t; }
			}
		} );
	}
	tagInterwikiLinks();
	new MutationObserver( function ( mutations ) {
		mutations.forEach( function ( m ) {
			m.addedNodes.forEach( function ( n ) {
				if ( n.nodeType === 1 ) { tagInterwikiLinks( n ); }
			} );
		} );
	} ).observe( document.body, { childList: true, subtree: true } );
}() );
