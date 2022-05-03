import React, { useEffect, useState } from "react";
import { FormControl, Select, MenuItem } from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import "./App.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          setCountries(countries);
        });
    };
    getCountriesData();
  }, [countries]);

  const countryChange = (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);
  };
  return (
    <section className="app">
      <article className="app__left">
        <header className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={countryChange} value={country}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </header>

        <section className="app__stats">
          <InfoBox title="Coronavirus Cases" />
          <InfoBox title="Recovered " />
          <InfoBox title="Deaths" />
        </section>

        <Map />
      </article>
      <article className="app__right"></article>
    </section>
  );
}

export default App;