import React, { useState, useEffect } from "react";
import "./CardStyle.css";
import etherscan from "../apis/etherscan";

let render=0;
let prevResults = [];
function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var half = a.getHours() < 12 ? "AM" : "PM";
  var hour = a.getHours() % 12;
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec + half;
  return (a.toLocaleDateString()+"  " +a.toLocaleTimeString());
}

const timeAgo = (uTime) => {};

const WalletCard = ({ address }) => {
  const [cardStatus, setCardStatus] = useState(false);
  const [cardClick, setCardClick] = useState(true);
  const [results, setResults] = useState([]);

  const renderedContent = results.map((res) => {
    if (!res) {
      return <div>No result found</div>;
    }
    return (
      <div>
        <a href={res.link}>Link</a>&emsp;&emsp;&emsp;
        <span>
          {res.action}&emsp;&emsp;&emsp;{timeConverter(res.timeStamp)}&emsp;&emsp;&emsp;{res.tokenName}&emsp;&emsp;&emsp;
        </span>
      </div>
    );
  });
  const onCardClicked = () => {
    setCardStatus(true);
    // setCardClick(!cardClick);
  };

  useEffect(() => {
    let timeInMs = 20000;
    if (render<2){
      timeInMs = 0;
      render++;
    }
    const timerId = setTimeout(() => {
      etherscan
        .get("/api", {
          params: {
            module: "account",
            action: "tokennfttx",
            address: address,
            page: "1",
            offset: "100",
            startblock: "0",
            endblock: "27025780",
            sort: "desc",
            apikey: "GHAJQTQDX53RAX6T8Q29TN68IM9J43JDYJ",
          },
        })
        .then((res) => {
          console.log(res);
          const outputData = res.data.result.map((res) => {
            const link = "https://etherscan.io/tx/" + res.hash;
            let action = "SELL";
            const timeStamp = res.timeStamp;
            const tokenName = res.tokenName;
            const tokenSymbol = res.tokenSymbol;
            if (res.to === address.toLowerCase()) {
              action = "BUY";
            }
            const finalResultObject = {
              link: link,
              action: action,
              timeStamp: timeStamp,
              tokenName: tokenName,
              tokenSymbol: tokenSymbol,
            };
            return finalResultObject;
          });
          try {
            // console.log(outputData[0].link + results[0].link)
            if(outputData[0].link!==results[0].link){
              setCardStatus(false);
            }
          } catch (error) {
            
          }
          setResults(outputData);    
         
        });
    },timeInMs);

    // return ()=>{
    //   clearTimeout(timerId);
    // }
  }, [results]);


  return (
    <div
      className="ui card "
      style={{
        backgroundColor: `${cardStatus ? "#ffa1a1" : "#9effa6"}`,
        width: "90%",
      }}
      onClick={onCardClicked}
      // onClick={() => setCardClick(!cardClick)}
    >
      <div className="content">
        <div className="">Address: {address}</div>
      </div>
      <div className="content">
        <div
          className={`segment ${cardClick ? "" : "disabled"}`}
          style={{ overflow: "auto", maxHeight: 200 }}
        >
          {renderedContent}
        </div>
      </div>
    </div>
  );
};
export default WalletCard;

// module: "account",
//           action: "balance",
//           address: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
//           tag: "latest",
//           apikey: "GHAJQTQDX53RAX6T8Q29TN68IM9J43JDYJ",
