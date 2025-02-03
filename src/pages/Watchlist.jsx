import React, { useEffect, useState } from "react";
import Header from "../components/Common/Header/Header";
import TabsComponent from "../components/Dashboard/Tabs/TabsComponent";
import Button from "../components/Common/Button/Button";
import { get100Coins } from "../functions/get100Coins";
import Loader from "../components/Common/Loader/Loader";
import { Link } from "react-router-dom";

function Watchlist() {
  const watchlist = JSON.parse(localStorage.getItem("watchlist"));
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (watchlist) {
      getData();
    }
  }, []);

  const getData = async () => {
    const allCoins = await get100Coins();
    if (allCoins) {
      setCoins(allCoins.filter((coin) => watchlist.includes(coin.id)));
    }
    setLoading(false);
  };

  return (
    <div>
      <Header />
      {loading ? (
        <Loader />
      ) : watchlist?.length > 0 ? (
        <>
          {coins === null || undefined || coins.length === 0 ? (
            <>
              <h1 style={{ textAlign: "center" }}>
                Sorry, Server can't get your data, please try again after
                sometime.
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
            <TabsComponent coins={coins} />
          )}
        </>
      ) : (
        <div>
          <h1 style={{ textAlign: "center" }}>
            Sorry, No Items In The Watchlist.
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
      )}
    </div>
  );
}

export default Watchlist;
