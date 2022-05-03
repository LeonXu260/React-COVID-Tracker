import React, { useEffect, useState } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import axios from "axios";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import "./App.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    axios.get("https://disease.sh/v3/covid-19/all").then((data) => {
      setCountryInfo(data.data);
    });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      try {
        await axios
          .get("https://disease.sh/v3/covid-19/countries")
          .then((data) => {
            const countries = data.data.map((country) => ({
              name: country.country,
              value: country.countryInfo.iso2,
            }));
            setCountries(countries);
          });
      } catch (e) {
        console.log(e);
      }
    };
    getCountriesData();
  }, []);

  const countryChange = async (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await axios.get(url).then((data) => {
      setCountry(countryCode);
      setCountryInfo(data.data);
    });
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
          <InfoBox
            title="Coronavirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBox
            title="Recovered "
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBox
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </section>

        <Map />
      </article>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new cases</h3>
        </CardContent>
      </Card>
    </section>
  );
}

export default App;