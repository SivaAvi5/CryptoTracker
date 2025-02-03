import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import { get100Coins } from "../functions/get100Coins";
import { getCoinData } from "../functions/getCoinData";
import { settingCoinObject } from "../functions/settingCoinObject";
import { getPrices } from "../functions/getPrices";
import { settingChartData } from "../functions/settingChartData";
import Header from "../components/Common/Header/Header";
import Loader from "../components/Common/Loader/Loader";
import SelectCoins from "../components/ComparePage/SelectCoins";
import List from "../components/Dashboard/List/List";
import ToggleComponents from "../components/CoinPage/ToggleComponent";
import LineChart from "../components/CoinPage/LineChart";
import Info from "../components/CoinPage/Info";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

function Compare() {
  const [allCoins, setAllCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [crypto1, setCrypto1] = useState("bitcoin");
  const [crypto2, setCrypto2] = useState("ethereum");
  const [coin1Data, setCoin1Data] = useState({});
  const [coin2Data, setCoin2Data] = useState({});
  const [days, setDays] = useState(30);
  const [priceType, setPriceType] = useState("prices");
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  // Fetch data only once when the component mounts
  useEffect(() => {
    // getData();
    getData();
  }, []);

  const getData = () => {
    setLoading(true);
    try {
      setTimeout(() => {
        get100Coins()
          .then((coins) => {
            if (coins) {
              setAllCoins(coins);
            }
          })
          .catch((error) => {
            console.error("Error fetching coins", error);
            setError(true);
          });
      }, 2000);
      setTimeout(() => {
        getCoinData(crypto1)
          .then((data1) => {
            if (data1) {
              const coinObj1 = settingCoinObject(data1, setCoin1Data);
            }
          })
          .catch((error) => {
            console.error("Error fetching data1:", error);
            setError(true);
          });
      }, 2000);
      setTimeout(() => {
        getCoinData(crypto2)
          .then((data2) => {
            if (data2) {
              const coinobj2 = settingCoinObject(data2, setCoin2Data);
            }
          })
          .catch((error) => {
            console.error("Error fetching data2:", error);
            setError(true);
          });
      }, 2000);

      setTimeout(() => {
        getPrices(crypto1, days, priceType)
          .then((prices1) => {
            if (prices1) {
              return prices1;
            }
          })
          .catch((error) => {
            console.error("Error fetching price1:", error);
            setError(true);
          })
          .then((prices1) => {
            getPrices(crypto2, days, priceType)
              .then((prices2) => {
                if (prices1 && prices2) {
                  settingChartData(setChartData, prices1, prices2);
                }
              })
              .catch((error) => {
                console.error("Error fetching price2:", error);
                setError(true);
              });
          });
      }, 2000);

      setTimeout(() => {
        setLoading(false);
      }, 5000);
    } catch (error) {
      setError(true);
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  // Debounce user interactions
  const onCoinChange = (e, isCoin2) => {
    try {
      if (isCoin2) {
        const newCrypto2 = e.target.value;
        setCrypto2(newCrypto2);
        setLoading(true);
        setTimeout(() => {
          return getCoinData(newCrypto2)
            .then((data2) => {
              if (data2) {
                settingCoinObject(data2, setCoin2Data);
              }
            })
            .then(() => {
              return getPrices(crypto1, days, priceType).then((prices1) => {
                return getPrices(newCrypto2, days, priceType).then(
                  (prices2) => {
                    if (prices1 && prices2) {
                      settingChartData(setChartData, prices1, prices2);
                    }

                    setLoading(false);
                  }
                );
              });
            });
        }, 3000);
      } else {
        const newCrypto1 = e.target.value;
        setCrypto1(newCrypto1);
        setLoading(true);
        setTimeout(() => {
          return getCoinData(newCrypto1)
            .then((data1) => {
              if (data1) {
                settingCoinObject(data1, setCoin1Data);
              }
            })
            .then(() => {
              return getPrices(newCrypto1, days, priceType).then((prices1) => {
                return getPrices(crypto2, days, priceType).then((prices2) => {
                  if (prices1 && prices2) {
                    settingChartData(setChartData, prices1, prices2);
                  }
                  setLoading(false);
                });
              });
            });
        }, 3000);
      }
    } catch (error) {
      setError(true);
      console.error("Error fetching coin data:", error);
      setLoading(false);
    }
  };

  const handleDaysChange = (e) => {
    const newDays = e.target.value;
    setLoading(true);
    try {
      setDays(newDays);
      setTimeout(() => {
        return getPrices(crypto1, newDays, priceType).then((prices1) => {
          return getPrices(crypto2, newDays, priceType).then((prices2) => {
            if (prices1 && prices2) {
              settingChartData(setChartData, prices1, prices2);
            }
            setLoading(false);
          });
        });
      }, 3000);
    } catch (error) {
      setError(true);
      console.error("Error fetching price data:", error);
    }
  };

  const handlePriceTypeChange = (e) => {
    const newPriceType = e.target.value;
    setLoading(true);
    try {
      setPriceType(newPriceType);
      setTimeout(() => {
        return getPrices(crypto1, days, newPriceType).then((prices1) => {
          return getPrices(crypto2, days, newPriceType).then((prices2) => {
            if (prices1 && prices2) {
              settingChartData(setChartData, prices1, prices2);
            }
            setLoading(false);
          });
        });
      }, 3000);
    } catch (error) {
      setError(true);
      console.error("Error fetching price type:", error);
    }
  };

  return (
    <div>
      <Header />
      {loading ? (
        <Loader />
      ) : error ? (
        <>
          <h1 style={{ textAlign: "center" }}>
            Error fetching data please try again later.
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
        </>
      ) : allCoins.length === 0 ||
        !coin1Data?.id ||
        !coin2Data?.id ||
        !chartData ||
        coin1Data.id !== crypto1 ||
        coin2Data.id !== crypto2 ? (
        <>
          <h1 style={{ textAlign: "center" }}>
            Sorry, Server can't get your data 😞, please try again after
            sometime!.
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
        </>
      ) : (
        !loading &&
        !error && (
          <>
            <p>welcome</p>
            <SelectCoins
              allCoins={allCoins}
              crypto1={crypto1}
              crypto2={crypto2}
              onCoinChange={onCoinChange}
              days={days}
              handleDaysChange={handleDaysChange}
              disabled={loading}
            />
            <div className="grey-wrapper">
              <List coin={coin1Data} />
            </div>
            <div className="grey-wrapper">
              <List coin={coin2Data} />
            </div>
            <div className="grey-wrapper">
              <ToggleComponents
                priceType={priceType}
                handlePriceTypeChange={handlePriceTypeChange}
              />
              <LineChart chartData={chartData} multiAxis={true} />
            </div>
            <Info title={coin1Data.name} desc={coin1Data.desc} />
            <Info title={coin2Data.name} desc={coin2Data.desc} />
          </>
        )
      )}
    </div>
  );
}

export default Compare;
