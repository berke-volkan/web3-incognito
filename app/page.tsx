"use client"
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { Fingerprint, MapPin, MessageCircleHeart, User, UserRoundCheck, WalletMinimal } from 'lucide-react';
import './envConfig.ts'
const Page = () => {
  const [address, setAddress] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(null);
  const [ethPrice, setEthPrice] = useState(null);
  const [ethbtc, setEthbtc] = useState(null);
  const etherscanApiKey = process.env.ETHERSCAN_API_KEY;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('https://api.web3.bio/profile/' + address);
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const profile = await response.json();
        setProfileData(profile);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message);
      }
    };

    const fetchTransactions = async () => {
      const  url2= `https://api.etherscan.io/v2/api?chainid=1&module=account&action=balance&address=${address}&tag=latest&apikey=${etherscanApiKey}`;
      const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&sort=desc&offset=10&page=1&apikey=${etherscanApiKey}`;
      
      try {
        const response = await fetch(url);
        const response2 = await fetch(url2);
        const data2= await response2.json();
        const data = await response.json();

        if (data.status === "1" && Array.isArray(data.result)) {
          setTransactions(data.result);
          setBalance(data2.result);
        } else {
          throw new Error('Failed to fetch transactions');
        }
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError(err.message);
      }
    };

    if (address) {
      fetchProfile();
      fetchTransactions();
    }
    
  }, [address]);
  useEffect(() => {
    const fetchEthPrice = async () => {
      const url3=`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${etherscanApiKey}`;
      try {
        const response = await fetch(url3);
        const data = await response.json();
        setEthPrice(data.result.ethusd);
        setEthbtc(data.result.ethbtc);
      } catch (err) {
        console.error('Error fetching eth price:', err);
        setError(err.message);
      }
    }
    fetchEthPrice();
  }, []);

  return (
    <div>
      <form style={{ marginLeft: "700px", marginTop: "25px" }} onSubmit={(e) => { e.preventDefault(); setAddress(e.target.wallet.value) }}>
        <input type="text" name="wallet" placeholder="Enter a wallet to research" className="rounded-md" style={{ textAlign: "center", color: "black" }} />
        <button type="submit" style={{ marginLeft: "5px" }}>Research</button>
      </form>

      <div style={{ display: "inline-block", verticalAlign: "top" }}>
        {profileData && profileData.map((profile) => (
          <Card key={profile.identity} style={{ width: '300px', margin: '10px', backgroundColor: "#4DA1A9", height: "auto", color: "#F6F4F0", minWidth: "500px", marginLeft: "50px" }} className="rounded-md">
            <div style={{ paddingLeft: "25px", paddingTop: "25px" }}>
              <CardHeader>
                <img src={profile.avatar} alt="avatar" className="rounded-full" height={50} width={40} style={{ display: "inline" }} />
                <h3 style={{ display: "inline", paddingLeft: "10px" }}>{profile.displayName} │ </h3>
                <p style={{ display: "inline " }}>#{profile.social.uid}</p>
              </CardHeader>
            </div>
            <CardHeader style={{ paddingLeft: "25px", paddingTop: "5px" }}>
              <p><User style={{ display: "inline" }} />Bio: {profile.description}</p>
              <p style={{ paddingTop: "5px" }}><WalletMinimal style={{ display: "inline" }} /> {profile.address}</p>
              <p style={{ paddingTop: "5px" }}><MessageCircleHeart style={{ display: "inline" }} /> {profile.social.follower} Followers</p>
              <p style={{ paddingTop: "5px" }}><UserRoundCheck style={{ display: "inline" }} /> {profile.social.following} Following</p>
              {profile.links.lens?.links && <p style={{ paddingTop: "5px" }}><Fingerprint style={{ display: "inline" }} /> {profile.links.lens.links} </p>}
              {profile.links.farcaster?.links && <p style={{ paddingTop: "5px" }} ><Fingerprint style={{ display: "inline" }} /> {profile.links.farcaster.links} </p>}
              {profile.location ? <p style={{ paddingTop: "5px", paddingBottom: "10px" }}><MapPin style={{ display: "inline" }} /> {profile.location}</p> : <p style={{ paddingTop: "5px", paddingBottom: "10px" }}><MapPin style={{ display: "inline" }} /> User Location is not provided</p>}
            </CardHeader>
          </Card>
        ))}
      </div>

      <div style={{ display: "inline-block", verticalAlign: "top", marginLeft: "250px", marginTop: "25px", width: "600px" }}>
        <Card style={{ background: "white", color: "black" }} className="rounded-md">
          <CardHeader>
            <h3 style={{ textAlign: "center" }}>How to use this tool?</h3>
          </CardHeader>
          <CardBody>
            <p style={{ paddingLeft: "5px" }}>1) Enter a wallet address in the search bar above and click on the Research button.</p>
            <p>2) It will fetch the profile of the user associated with the wallet address.</p>
            <p>3) It will display the profile information of the user.</p>
          </CardBody>
        </Card>
        {profileData&& <h3 style={{paddingTop:"10px"}}>LATEST 10 TRANSACTIONS (Account balance: {balance&& balance/1000000000000000000} ETH - {ethPrice*(balance/1000000000000000000)} USD - {ethbtc*(balance/1000000000000000000)} BTC)</h3>}
        {transactions.map((transaction) => (
          <Card key={transaction.hash} style={{ paddingTop: "10px", background: "white", color: "black", marginTop: "10px" }} className="rounded-md">
            <CardBody style={{ paddingLeft: "10px",paddingTop: "10px" }}>
              <p>Transaction Hash: {transaction.hash}</p>
              <p>Block Number: {transaction.blockNumber}</p>
              <p>From: {transaction.from}</p>
              <p>To: {transaction.to}</p>
              <p>Value: {transaction.value}</p>
              <p>Gas: {transaction.gas}</p>
              <p>Gas Price: {transaction.gasPrice}</p>
              <p>Time Stamp: {transaction.timeStamp}</p>
            </CardBody>
          </Card>
        ))}
        {!profileData &&
         <Card style={{ background: "white", color: "black", marginTop: "10px" }} className="rounded-md">
          1 ETH = {ethPrice} USD <br />
          1 ETH = {ethbtc} BTC
          <br/> <br/>

          1 BTC = {1/ethbtc} ETH <br />
          1 BTC = {(1/ethbtc)*ethPrice} USD

          <br/> <br/>
          1 USD = {1/ethPrice} ETH <br />
          1 USD = {(1/ethPrice)*ethbtc} BTC
         </Card>
        }
      </div>
    </div>
  );
};

export default Page;