# 3166 (iso standart about 2-3 letter codes of administrative divisions)
This world is small enough. But not everyone knows all countries and all states. So, lets just create a list of countries as iso3166-1 and lists of states or regions as iso3166-2. And include external references to all sources, you may use (GeoNames, OpenStreetMap, Wikipedia, WOF)

* How to get list of all countries: call `getDataSet` and traverse look for .name in every object inside
* How to get states of country: call getRegionsFor(countryIsoCode) and do the same.

Just look at json file, and you will understand.
 
So we have 2 simple things:
 1. data/iso3166-2.json – main datafile. It containtains all counties and all regions. 
 Just keep in mind - this is not a stupid list of names. We provide all information for any entity:
 
    * iso3166-1(alpha2, alpha3, numeric, FIPS) for a country    
    * iso3166-2(alpha2, FIPS) for a region    
    * links to geonames, openstreetmap relation, wikipedia article, WOT. So you can merge this data, to everything else!    
    * names in main languages
    
    Best option is to use this file directly.
 2. src/disputedBorders.js – set of pure functions to transform main data file for "your" country. As long all countries have their own mind.
    Only UN001(US), RU, UA, TR schemes supported.
    
    **Remember – main data file is `wrong` by default. You HAVE to apply some filter to data.**
    Or you will get TW as country and Crimea as part of  Russia (use 'ru' dispute mode to have it :P). 
 3. src/iso3166.js – library logic (exported as index.js)
 
    We have a simply command for it(2.) getDataSet(dispute='en') for it.
    
     * changeDispute(string) – change default dispute.
     * getDataSet([dispute]) - returns transformed iso3166 data.
     * getRegionsFor(country) - returns states for a country.     
     * findCountryByName(countryName) - perform lookup via all possible names
     * findRegionByCode(string(iso3166-2 code)) - returns region for a code. AU-NSW for example
   
**nd be aware** - some `states` is not a states. Until they have iso3166-2(iso) code.
Some of them contain only `FIPS`.

Also **be aware** about operstreetmap_level. Most of regions have `4`. Some of them (in Slovenia) have `6`. But.. there is regions with `7`.
I am not sure about them.

This is open source made from open source. Everything can be wrong. And will be.

Main datafile is auto generated from free sources.

Used sources:    
  1. Geonames.org – as main information source
  2. Wikipedia.org – as main information source
  3. Esosedi.org – as main information source 
  4. OpenStreetMap.org – as secondary source
  5. Whosonfirst-data – as external links for region information (as long Pelias return region code as WOT entity)
    