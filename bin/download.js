const fs = require('fs').promises
const fetch = require('node-fetch')
const supportedLanguages = require('../languages.json')
const osm = require('../data/names_osm.json')
const geonames = require('../data/names_geonames.json')
const wiki = require('../data/iso3166-2.json');


main()


async function downloadWikipedia() {
	for(let key of Object.keys(wiki)) {
        const country = wiki[key].reference.wikipedia.split(':')[1].replace(/_/g, '%20')
        const result = await fetch(`https://commons.wikimedia.org/w/api.php?action=query&titles=${country}&prop=langlinks&lllimit=500&format=json&rawcontinue&redirects`).then(res => res.json())
        if(result && result.query && result.query.pages) {
            const pageKey = Object.keys(result.query.pages)[0]
            const page = result.query.pages[pageKey]
            if(page && Array.isArray(page.langlinks)) {
                for(let langEntry of page.langlinks) {
                    if(supportedLanguages.indexOf(langEntry.lang) >= 0)
                        wiki[key].names[langEntry.lang] = langEntry['*'].replace(/\s*\(.*\)\s*$/, '')
                }
            }
        }
    }
}

async function downloadOSM() {
	for(let key of Object.keys(osm)) {
        const result = await fetch(`https://www.openstreetmap.org/api/0.6/relation/${key}/`).then(res => res.text())
        osm[key] = {}
        result.replace(/<tag k="name:(..)" v="([^"]+)"\/>/g, async function(m, code, value) {
            if(supportedLanguages.indexOf(code) >= 0 && !osm[key][code])
                osm[key][code] = value
        })
    }
}

async function downloadGeonames() {
	for(let key of Object.keys(geonames)) {
        const result = await fetch(`https://www.geonames.org/servlet/geonames?&srv=150&geonameId=${key}&type=json`).then(res => res.json())
        if(result && Array.isArray(result.geonames)) {
            for(let geoname of result.geonames) {
                if(supportedLanguages.indexOf(geoname.locale) >= 0)
                    geonames[key][geoname.locale] = geoname.name
            }
        }
    }
}

async function main() {
	await Promise.all([downloadGeonames(), downloadOSM(), downloadWikipedia()])
	console.log('Download complete')
	await Promise.all([
		fs.writeFile('./data/names_geonames.json', JSON.stringify(geonames, 4, 4)),
		fs.writeFile('./data/names_osm.json', JSON.stringify(osm, 4, 4)),
		fs.writeFile('./data/iso3166-2.json', JSON.stringify(wiki, 4, 4))
	])
}