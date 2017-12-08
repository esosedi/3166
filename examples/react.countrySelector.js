import React, {PureComponent} from 'react';
import listOfCountries from 'iso3166-2-db/i18n/dispute/UN/en';

/* or
 import pureListOfCountries from 'iso3166-2-db/i18n/en';
 import { getDataSet } from 'iso3166-2-db/api';
 const listOfCountries = getDataSet('en', pureListOfCountries);
 */

class AddressSelector extends PureComponent {
  state = {};

  onCountryChange = (event) => this.setState({
    selectedCountry: event.target.value
  });

  onRegionChange = (event) => this.setState({
    selectedRegion: event.target.value
  });

  // render list of countries
  renderCountrySelector() {
    return (
      <select onChange={this.onCountryChange}>
        {
          Object.keys(listOfCountries).map(isoCode =>
            <option key={isoCode} value={isoCode}>{listOfCountries[isoCode].name}</option>
          )
        }
      </select>
    )
  }

  // render list of states for selected country
  renderStateSelector() {
    const {selectedCountry} = this.state;
    if (!selectedCountry) {
      return null;
    }
    const regions = listOfCountries[selectedCountry].regions;
    return (
      <select onChange={this.onRegionChange}>
        {
          regions.map(region =>
            <option key={region.iso} value={region.iso}>{region.name}</option>
          )
        }
      </select>
    )
  }

  render() {
    return (
      <div>
        { this.renderCountrySelector() }
        { this.renderStateSelector() }
      </div>
    )
  }
}