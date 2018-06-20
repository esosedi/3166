# iso3166, iso3166-1, iso3166-2  
(ISO standard about N-letter codes of administrative divisions and subdivisions)
In other words - Administrative Divisions of Countries (aka "Statoids" or "Country names").

The country codes are mainly in the ISO 3166-1 `alpha 2` format (US, SE ...). 
It also possible to use `alpha 3` codes (USA, SWE ...) or `alpha-numeric codes`. In most cases you need alpha-2.

[![Build Status](https://secure.travis-ci.org/esosedi/3166.svg)](http://travis-ci.org/esosedi/3166)

[![NPM](https://nodei.co/npm/iso3166-2-db.png?downloads=true&stars=true)](https://nodei.co/npm/iso3166-2-db/)

>This world is small enough. 
But not everyone knows all countries and all states.
List of countries is known as iso3166-1 and lists of states or regions is known as iso3166-2. 
And lets extend information withexternal references to all sources, you may use (GeoNames, OpenStreetMap, Wikipedia, WOF)
This is nodejs/javascript module, but you can use it as set of json files from other languages 

```javascript
import worldDatabase from 'iso3166-2-db/i18n/dispute/UN/en';
import listOfCountries from 'iso3166-2-db/countryList/dispute/UN/en';
import USregions from 'iso3166-2-db/regions/US/dispute/UN/en';
```
[![Try it online ](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/LgBN3qy5j) 
- try it online.

# FYI
* iso3166-1 is a country list
* iso3166-2 is states, regions, provinces and so on.

# Fast onboarding
```javascript
    // to get both states and countries in an English from UN prospective
    import data from 'iso3166-2-db/i18n/dispute/UN/en';

    // to get only list countries in an English from UN prospective
    import data from 'iso3166-2-db/countryList/UN/en';
    
    // to get only list stated for the country in an %Lang% from UN prospective
    import data from 'iso3166-2-db/regions/{COUNTRYISOCODE}/UN/{lang}';
```
Yep. Did not forget to add `/dispute/UN/`. It is the main difference between this library and any other - it knows that world is not united, yet.

# About
* This library provides both iso3166-1 and iso3166-2 codes
* This library is capable to generate data for different `points of view` (ie [Territorial dispute](https://en.wikipedia.org/wiki/Territorial_dispute))
* This library is both modular and functional. Fits both for frontend and backend
* This library contain external references to a `trusted` sources
* This library is brought to you by esosedi – one of largest cartographical site in the World. And in the past.

# Usage
> npm install iso3166-2-db

You have 2 ways to use this library:
 1. Use it at `backend`. Just import few function from 'iso3166-2-db' and go on.
 You will have everything - all data, pack of languages, with different dispute models and name sources.
 But - full database has a size of few megabytes.
 
 2. Use it as data files, ie modular format - this way is preferred for `frontend`. 
 Result will produce much smaller code.
  
# Modular API
 * There is two versions on `modular` API - `pure` and `compiled`.
 In 99% cases you need - compiled
 ```javascript
    // to get country list.
    import data from 'iso3166-2-db/countryList/dispute/UN/{lang}'
    // to get states(regions) for selected country.
    import data from 'iso3166-2-db/regions/{iso3166-1}/dispute/UN/{lang}'
    // to get both states and countries.
    import data from 'iso3166-2-db/i18n/dispute/UN/{lang}'
 ```
 
 Where UN - is United Nations. World from United Nations point of view. We call this - `dispute`.
 Possible values - UN, UA, TR, RU. IF you need more - open a pull request.
 
 You can also load `pure` data:  
 
 ```javascript
    //to get country list.
    import data from 'iso3166-2-db/countryList/{lang}' 
    // to get states(regions) for selected country.
    import data from 'iso3166-2-db/regions/{iso3166-1}/*'
    //to get both states and countries.
    import data from 'iso3166-2-db/i18n/{lang}'
 ```
 
 PS: import ..._ref, to get data with external references. It has a bit bigger size.
  ```javascript
     import data from 'iso3166-2-db/i18n/{lang}_ref'
  ```
 
 ### example
 ```javascript
  // just import what you want - /countryList/{lang}
  import countryList from 'iso3166-2-db/countryList/en';
 
  // or, to have foreignKeys to wikipedia, geonames and so on
  import countryListWithForeignKeys from 'iso3166-2-db/countryList/en_ref';

  // import states for a country /countryList/{iso1}/{lang}
  // import states for a country /countryList/{iso1}/dispute/{source}/{lang}

  //  will import RU states for point of view of United Nations - without Crimea
  import US from 'iso3166-2-db/regions/RU/dispute/UN/en';
  //  will import RU states for point of view of Russia - including Crimea
  import US from 'iso3166-2-db/regions/RU/dispute/RU/en';
  ```
  
  ### Advanced usage
  1. Import unprocessed, `pure` data
  ```javascript
  // you can import `default` dataset
  import US from 'iso3166-2-db/regions/US/en';
  // or, import with foreignKeys
  import US from 'iso3166-2-db/regions/US/en_ref';
  import DE from 'iso3166-2-db/regions/DE/de_ref';// use other lang for other country? Simple! 
  
  //import combine function
  import { combine } 'iso3166-2-db/combine';
  
  // join country dataset with states
  const dataSet = combine(countryList, { US }) ;// !!!! region object key MUST match iso code.
  // dataSet is similar to i18n, but contains regions only for US, not for a whole world.   
  
```
  To process `pure` data you should call getDataSet command.
  ```javascript
  
  // you can also import only function from library, with out data 
  import { getDataSet, getRegionsFor, changeDispute, changeNameProvider, findCountryByName, findRegionByCode } from 'iso3166-2-db/api';
  
  const fixedDataSet = getDataSet('en', combine(countryList, { US }));
  // this command will move some disputed regions across countries.
  // without this command few things can be wrong. See below.  
 ```

 I hope you did not understand, what `dispute` means, and why you should run getDataSet.
 it is very simple -
 ```js 
 import RU from 'iso3166-2-db/regions/RU/dispute/UN/en' // - will NOT contain Crimea
 import RU from 'iso3166-2-db/regions/RU/en'            // - will NOT contain Crimea
 import RU from 'iso3166-2-db/regions/RU/dispute/RU/en' // - will CONTAIN Crimea
 const fixedDataSet = getDataSet('ru', combine(countryList, { RU })); // - will CONTAIN Crimea
 ```
 Also some countries are not exists, or exists not as counties, but as stated by point of view of some different countries.
 
 
 
### creating country selector with React
 See [example](//esosedi/3166/examples/react.countrySelector.js)
 
# Functional API

* How to get list of all countries: call `getDataSet` and traverse look for .name in every object inside
* How to get states of country: call getRegionsFor(countryIsoCode) and do the same.
 
Just look at source json file(data/iso3166-2.json), and you will understand.
 
So we have some simple things:
 1. data/iso3166-2.json – main datafile. It containtains all counties and all regions. 
 Just keep in mind - this is not a stupid list of names. We provide all information for any entity:
 
    * iso3166-1(alpha2, alpha3, numeric, FIPS) for a country    
    * iso3166-2(alpha2, FIPS) for a region    
    * links to geonames, openstreetmap relation, wikipedia article, WOF. So you can merge this data, to everything else!    
    * names in main languages
    
    Best option is to use this file directly.
 2. src/disputedBorders.js – set of pure functions to transform main data file for "your" country. As long all countries have their own mind.
    Only UN001(US), RU, UA, TR schemes supported.
    
    **Remember – main data file is `wrong` by default. You HAVE to apply some filter to data.**
    Or you will get TW as country and Crimea as part of  Russia (use 'ru' dispute mode to have it :P).
    
    **Remember – to add one region to one place, you have to remove it from other place**
     Ie, to `add` Crimea into Russian states you have to have US states.
     
 3. src/iso3166.js – library logic (main entry point)
 
    We have a simply command for it(2.) getDataSet(dispute='en') for it.
    
     * changeDispute(string) – change default dispute.
     * getDataSet([dispute], [dataSet]) - returns transformed iso3166 data.
     * getRegionsFor(country) - returns states for a country.     
     * findCountryByName(countryName) - perform lookup via all possible names
     * findRegionByCode(string(iso3166-2 code)) - returns region for a code. AU-NSW for example
     
 4. And every one have their own `knowlege` about naming. And every one have different.
     What is why we create this library – to bring a peace (and foreign keys).
     
    But, you really might wish to use different names from different sources. And we have a tools for it!
    
    * data/names_geonames.json – all region names from geonames.org
    * data/names_osm.json – same from openstreetmap.org
    
    Just call `changeNameProvider('geonames|osm|wikipedia')` _(yap, buy default we use wikipedia article names)_
    
    Working only for `backend way`.
    
 5. And do not forget **THIS THING IS FOR BACKEND**!
    Datafiles are VERY large. But you can reduce them.
    Call `reduce(dataSet, lng, listOfCountries)` to get data ONLY for one language and selected countries.
    _name will be filled into .name field of entity. .names will be dropped._
    
    example: reduce(getDataSet(), 'en', ['US','CA','AU']) 
   
**And be aware** - some `states` are not the states. Until they have iso3166-2(iso) code.
Some of them contain only `FIPS`.

Also **be aware** about operstreetmap_level. Most of regions have `4`. Some of them (in Slovenia) have `6`. But.. there is regions with `7`.
I am not sure about them.

This is open source made from open source. Everything can be wrong. And will be.

Main datafile is auto generated from free sources.

# Data format
 Country list is a hash. 
 Key is a iso3166-1 code
 Value 
 ```js 
 {
     "iso": "AD",   //iso3166-1 `two` letter code
     "iso3": "AND", //iso3166-1 `three` letter code
     "numeric": 20, //iso3166-1 `numeric` code
     "fips": "AN",  //FIPS code
     // next key is exist only in `_ref` exports
     "reference": { // external reference to
         "geonames": 3041565,      // geonames.org 
         "openstreetmap": 9407,    // openstreetmap releation id
         "wikipedia": "en:Andorra" // wikipedia article
     },
     // next key is not exist in full pack
     name: "Andorra",
     // next key is not exist in language-reduced pack 
     "names": {                    // names in different languages
         "geonames": "Andorra",
         "en": "Andorra",
         "ar": "أندورا",
         "de": "Andorra",
         "es": "Andorra",
         "fr": "Andorre",
         "it": "Andorra",
         "ru": "Андорра",
         "zh": "Chinese"
     },
     regions:[ /* set of regions */]
   }
 ```
 
 Regions is an array of
 ```js 
 {
     // next keys will contain name in selected language
     "name": "Sant Julià de Lòria",
     // next keys is not exists in language-reduced pack
     "names": {
         "geonames": "Parroquia de Sant Julia de Loria",
         "ru": "Сан-Жулиа-де-Лория",
         "en": "Sant Julià de Lòria",
         "de": "Sant Julià de Lòria",
         "es": "San Julián de Loria",
         "fr": "Sant Julià de Lòria",
         "it": "Parrocchia di Sant Julià de Lòria",
         "zh": "圣胡利娅-德洛里亚"
     },                 
     "iso": "06",    // iso3166-2 code
     "fips": "06",   // FIPS code
     // next key is exist only in `_ref` exports
     "reference": {
         "geonames": 3039162,                   // geonames.org
         "openstreetmap": 2804759,              // openstreetmap relation id
         "openstreetmap_level": 7,              // openstreetmap administrative division level
         "wikipedia": "en:Sant_Julià_de_Lòria", // wikipedia article
         "wof": null                            // WOF code 
     }
 },
 ```

Used sources:    
  1. [geolocated.org](http://geolocated.org/) – as primary source.
  2. [Geonames.org](http://geonames.org/) – as main information source
  3. [Wikipedia.org](http://wikipedia.org/) – as main information source
  4. [Esosedi.org](http://esosedi.org/) – as main information source 
  5. [OpenStreetMap.org](http://openstreetmap.org/) – as secondary source
  6. [Whosonfirst-data](https://github.com/whosonfirst-data/) – as external links for region information (as long Pelias return region code as WOF entity]

As result - iso3166-2-db is best best free source for countries divisions. With incomparable to [Statoids](http://www.statoids.com/)(1000$ btw) quality. I mean - this one is better.  
    
All sources used as external dictionaries, for ability to link and merge data.
Countries and states exists by themselves and have their own names.
You dont have to refer to us, to wikipedia, to osm, geonames or everything else in cases you showing `our` list of countries.

This is not `our` or `their` list. This is ground truth, and it cannot be licensed.
We are on the same planet.
    
