import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Info from "../components/CoinPage/Info";
import LineChart from "../components/CoinPage/LineChart";
import SelectDays from "../components/CoinPage/SelectDays/SelectDays";
import ToggleComponents from "../components/CoinPage/ToggleComponent";
import Header from "../components/Common/Header/Header";
import Loader from "../components/Common/Loader/Loader";
import Button from "../components/Common/Button/Button";
import List from "../components/Dashboard/List/List";
import { getCoinData } from "../functions/getCoinData";
import { settingCoinObject } from "../functions/settingCoinObject";
import { getPrices } from "../functions/getPrices";
import { settingChartData } from "../functions/settingChartData";

function Coin() {
  const { id } = useParams();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({ labels: [], datasets: [{}] });
  const [coin, setCoin] = useState({});
  const [days, setDays] = useState(30);
  const [priceType, setPriceType] = useState("prices");

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);

  const getData = async () => {
    setLoading(true);
    let coinData = await getCoinData(id, setError);
    console.log("Coin DATA>>>>", coinData);
    if (!coinData) {
      setLoading(false);
    }
    settingCoinObject(coinData, setCoin);

    if (coinData) {
      const prices = await getPrices(id, days, priceType, setError);
      if (!prices) {
        setLoading(false);
      }
      if (prices) {
        settingChartData(setChartData, prices);
        setLoading(false);
      }
    }
  };

  const handleDaysChange = async (event) => {
    setLoading(true);
    setDays(event.target.value);
    const prices = await getPrices(id, event.target.value, priceType, setError);
    if (prices) {
      settingChartData(setChartData, prices);
      setLoading(false);
      console.log(loading);
    }
  };

  const handlePriceTypeChange = async (event) => {
    setLoading(true);
    setPriceType(event.target.value);
    const prices = await getPrices(id, days, event.target.value, setError);
    if (prices) {
      settingChartData(setChartData, prices);
      setLoading(false);
    }
  };

  console.log(chartData);

  return (
    <>
      <Header />
      {loading && <Loader />}
      {!loading && coin.id ? (
        <>
          <div className="grey-wrapper">
            <List coin={coin} delay={0.5} />
          </div>
          <div className="grey-wrapper">
            <SelectDays handleDaysChange={handleDaysChange} days={days} />
            <ToggleComponents
              priceType={priceType}
              handlePriceTypeChange={handlePriceTypeChange}
            />
            <LineChart chartData={chartData} />
          </div>
          <Info title={coin.name} desc={coin.desc} />
        </>
      ) : (
        error && (
          <div>
            <h1 style={{ textAlign: "center" }}>
              Sorry, Couldn't find the coin you're looking for 😞
            </h1>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "2rem",
              }}
            >
              <Link to="/dashboard">
                <Button text="Dashboard" />
              </Link>
            </div>
          </div>
        )
      )}
    </>
  );
}

export default Coin;
