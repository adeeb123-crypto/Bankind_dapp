import React, { Component, useRef } from "react";
import { Button, Form } from "semantic-ui-react";
import { useState } from "react";
import { useEffect } from "react";
import {
  Header,
  Icon,
  Image,
  Segment,
  Divider,
  Table,
  Breadcrumb,
  Accordion,
  Grid,
} from "semantic-ui-react";
import { contractAddressFed, ABIFed } from "../constants";
import { contractAddressEcb, ABIEcb } from "../constants";
import { contractAddressbnksys, ABIbnksys } from "../constants";
import { Card } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import "./branch.css";

const colors = ["#393053"];

const Web3 = require("web3");
const ethers = require("ethers");

function Branch() {
  const [bankid, setBankID] = useState("");
  const [branchid, setBranchID] = useState("");
  const [amount, setAmount] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [clientaddress, setClientAddress] = useState("");
  const [centralbankid, setCentralBankID] = useState("");
  const [arrayData, setArrayData] = useState([]);
  const [arrayDataForexDet, setArrayDataForexDet] = useState([]);
  const [arrayDataBorrowDet, setArrayBorrowDet] = useState([]);
  const [arrayDataBorrowDispDet, setArrayBorrowDispDet] = useState([]);
  const [newarrayData, setNewArrayData] = useState([]);
  const [balancebranch, setBalanceBranch] = useState("");
  const [symbolbranch, setSymbolBranch] = useState("");
  const [detailsbranchid, setDetailsBranchID] = useState("");
  const [isconnectbuttonclicked, setIsConnectButtonClicked] = useState(false);
  const [isApprovedButton, setIsApprovedButton] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isActive, setIsActive] = useState("");
  const [eurBranch, setEurBranch] = useState("");
  const [usdBranch, setUsdBranch] = useState("");
  const [branchname, setBranchName] = useState("");
  const navigate = useNavigate();

  const ref = useRef(null);

  function handleClickEventForex() {
    if (isActive == 2) {
      setIsActive("");
    } else {
      setIsActive(2);
    }
  }

  function handleClickEventLend() {
    if (isActive == 1) {
      setIsActive("");
    } else {
      setIsActive(1);
    }
  }

  useEffect(() => {
    let temp_data = window.localStorage.getItem("DataC");
    if (temp_data) {
      temp_data = JSON.parse(temp_data);
      setArrayData(temp_data);
    }

    let temp_data_frx_det = window.localStorage.getItem("DataFrxDet");
    if (temp_data_frx_det) {
      temp_data_frx_det = JSON.parse(temp_data_frx_det);
      setArrayDataForexDet(temp_data_frx_det);
    }

    let temp_data_brr_det = window.localStorage.getItem("DataBrrDet");
    if (temp_data_brr_det) {
      temp_data_brr_det = JSON.parse(temp_data_brr_det);
      setArrayBorrowDet(temp_data_brr_det);
    }

    let temp_data_disp_brr_det = window.localStorage.getItem("DataBrrDispDet");
    if (temp_data_disp_brr_det) {
      temp_data_disp_brr_det = JSON.parse(temp_data_disp_brr_det);
      setArrayBorrowDispDet(temp_data_disp_brr_det);
    }

    function handleClickOutside(event) {
      if (ref.current && ref.current.contains(event.target)) {
        setIsActive(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

    if (temp_data && temp_data_frx_det && temp_data_brr_det) return;
  }, [arrayData, arrayDataForexDet, setArrayBorrowDet]);

  async function addClient() {
    try {
      if (
        typeof window !== "undefined" &&
        typeof window.ethereum !== "undefined"
      ) {
        const accounts = await window.ethereum.enable();
        console.log("accounts", accounts);
        const provider = await new ethers.providers.Web3Provider(
          window.ethereum
        );
        const signer = await provider.getSigner();
        console.log("Signer", signer);
        const address = await signer.getAddress();
        console.log(address);
      } else {
        console.log("MemtaMask Not Installed!!!");
      }
      const web3eth = new Web3(Web3.givenProvider);

      const callContract = new web3eth.eth.Contract(
        ABIbnksys,
        contractAddressbnksys
      );
      const callContractECB = new web3eth.eth.Contract(
        ABIEcb,
        contractAddressEcb
      );
      const callContractFED = new web3eth.eth.Contract(
        ABIFed,
        contractAddressFed
      );
      if (web3eth.givenProvider) {
        console.log("Hello Provider Here", web3eth.givenProvider);
        let address = web3eth.givenProvider.selectedAddress;
        console.log("address", address);

        let IDByAddress = await callContract.methods
          .idOfAddress(address)
          .call();

        if (IDByAddress.bankId == 0) {
          setTokenSymbol("EUR");
          let responseEcb = await callContractECB.methods
            .approve(contractAddressbnksys, 100000000000)
            .send({ from: address, gas: 1000000 });
          console.log("Response :", responseEcb);
          let response = await callContract.methods
            .addClient(
              IDByAddress.bankId,
              branchid,
              clientaddress,
              amount * 100000000,
              "EUR"
            )
            .send({ from: address, gas: 1000000 });
          console.log(response);
          let clientid1 = await callContract.methods
            .clientCount(IDByAddress.bankId, branchid)
            .call();

          let clientDetails1 = await callContract.methods
            .clients(IDByAddress.bankId, clientid1 - 1)
            .call();
          console.log("clientid1:", clientid1);
          console.log("clientDetails1:", clientDetails1);

          let tmp_data = arrayData;
          tmp_data.push(clientDetails1);
          console.log(tmp_data);
          setArrayData(tmp_data);
          window.localStorage.setItem("DataC", JSON.stringify(tmp_data));
          console.log("arrayData:", arrayData);
          console.log("arrayData:", arrayData[0].amount);
          console.log("arrayData:", arrayData[0].client);
        } else {
          setTokenSymbol("USD");
          let responseFed = await callContractFED.methods
            .approve(contractAddressbnksys, amount * 100000000)
            .send({ from: address, gas: 1000000 });

          console.log("Response :", responseFed);
          let response = await callContract.methods
            .addClient(
              IDByAddress.bankId,
              branchid,
              clientaddress,
              amount * 100000000,
              "USD"
            )
            .send({ from: address, gas: 1000000 });
          console.log(response);

          let clientid2 = await callContract.methods
            .clientCount(IDByAddress.bankId, branchid)
            .call();

          let clientDetails2 = await callContract.methods
            .clients(IDByAddress.bankId, clientid2 - 1)
            .call();
          console.log("clientid1:", clientid2);
          console.log("clientDetails1:", clientDetails2);

          let tmp_data = arrayData;
          tmp_data.push(clientDetails2);
          console.log(tmp_data);
          setArrayData(tmp_data);
          window.localStorage.setItem("DataC", JSON.stringify(tmp_data));
          console.log("arrayData:", arrayData);
          console.log("arrayData:", arrayData[0].amount);
          console.log("arrayData:", arrayData[0].client);
        }
      }
    } catch (error) {
      console.log(Error);
    }
  }

  async function checkForexRequest() {
    try {
      if (
        typeof window !== "undefined" &&
        typeof window.ethereum !== "undefined"
      ) {
        const accounts = await window.ethereum.enable();
        console.log("accounts", accounts);
        const provider = await new ethers.providers.Web3Provider(
          window.ethereum
        );
        const signer = await provider.getSigner();
        console.log("Signer", signer);
        const address = await signer.getAddress();
        console.log(address);
      } else {
        console.log("MemtaMask Not Installed Maen");
      }
      const web3eth = new Web3(Web3.givenProvider);

      const callContract = new web3eth.eth.Contract(
        ABIbnksys,
        contractAddressbnksys
      );
      const callContractECB = new web3eth.eth.Contract(
        ABIEcb,
        contractAddressEcb
      );
      const callContractFED = new web3eth.eth.Contract(
        ABIFed,
        contractAddressFed
      );
      if (web3eth.givenProvider) {
        console.log("Hello Provider Here", web3eth.givenProvider);
        let address = web3eth.givenProvider.selectedAddress;
        console.log("address", address);

        let IDByAddress = await callContract.methods
          .idOfAddress(address)
          .call();

        if (IDByAddress.bankId == 0) {
          setTokenSymbol("EUR");
          setEurBranch("Europe Branch");

          let IDByAddress = await callContract.methods
            .idOfAddress(address)
            .call();

          let balanceOf = await callContractECB.methods
            .balanceOf(address)
            .call();
          setBalanceBranch(balanceOf);

          let forexDetails = await callContract.methods
            .forexDetails(address)
            .call();
          console.log("forexDetails", forexDetails);

          let ReqDetailsClient1 = await callContract.methods
            .requestDetails(forexDetails.byClient, forexDetails.reqId)
            .call();

          let response = await callContract.methods
            .sendForexRequestToBank(
              ReqDetailsClient1.fromBankId,
              ReqDetailsClient1.fromBranchId,
              forexDetails.clientId,
              ReqDetailsClient1.reqId
            ) //Needs Debuging//DOne!!
            .send({ from: address, gas: 1000000 });

          let ReqDetailsClient11 = await callContract.methods
            .requestDetails(forexDetails.byClient, forexDetails.reqId)
            .call();

          let tmp_data = arrayDataForexDet;
          tmp_data.push(ReqDetailsClient11);
          console.log(tmp_data);
          setArrayDataForexDet(tmp_data);
          window.localStorage.setItem("DataFrxDet", JSON.stringify(tmp_data));
          console.log("rrayDataForexDet:", arrayDataForexDet);
          console.log("rrayDataForexDet:", arrayDataForexDet[0].amount);
          console.log("rrayDataForexDet:", arrayDataForexDet[0].bank);
        } else {
          setTokenSymbol("USD");
          setUsdBranch("USD Branch");

          let balanceOf = await callContractFED.methods
            .balanceOf(address)
            .call();
          setBalanceBranch(balanceOf);

          let IDByAddress = await callContract.methods
            .idOfAddress(address)
            .call();

          let forexDetails = await callContract.methods
            .forexDetails(address)
            .call();
          console.log("forexDetails", forexDetails);

          let ReqDetailsClient1 = await callContract.methods
            .requestDetails(forexDetails.byClient, forexDetails.reqId)
            .call();

          let response = await callContract.methods
            .sendForexRequestToBank(
              ReqDetailsClient1.fromBankId,
              ReqDetailsClient1.fromBranchId,
              forexDetails.clientId,
              ReqDetailsClient1.reqId
            )
            .send({ from: address, gas: 1000000 });

          let ReqDetailsClient11 = await callContract.methods
            .requestDetails(forexDetails.byClient, forexDetails.reqId)
            .call();

          console.log("ReqDetailsAddress :", forexDetails);
          console.log("ReqDetailsClient1 :", ReqDetailsClient1);

          // response = {addres: hhkujiiio, status: true, id:555, amount:8885454}
          let tmp_data = arrayDataForexDet;
          tmp_data.push(ReqDetailsClient11);
          console.log("tmp_data", tmp_data);
          setArrayDataForexDet(tmp_data);
          window.localStorage.setItem("DataFrxDet", JSON.stringify(tmp_data));
          console.log("arrayDataForexDet:", arrayDataForexDet[0].amount);
          console.log("arrayDataForexDet:", arrayDataForexDet[0].bank);
        }
      }
    } catch (error) {
      console.log(Error);
    }
  }
  async function checkDetails() {
    try {
      if (
        typeof window !== "undefined" &&
        typeof window.ethereum !== "undefined"
      ) {
        const accounts = await window.ethereum.enable();
        console.log("accounts", accounts);
        const provider = await new ethers.providers.Web3Provider(
          window.ethereum
        );
        const signer = await provider.getSigner();
        console.log("Signer", signer);
        const address = await signer.getAddress();
        console.log(address);
      } else {
        console.log("MemtaMask Not Installed Maen");
      }
      const web3eth = new Web3(Web3.givenProvider);

      const callContract = new web3eth.eth.Contract(
        ABIbnksys,
        contractAddressbnksys
      );
      const callContractECB = new web3eth.eth.Contract(
        ABIEcb,
        contractAddressEcb
      );
      const callContractFED = new web3eth.eth.Contract(
        ABIFed,
        contractAddressFed
      );
      if (web3eth.givenProvider) {
        console.log("Hello Provider Here", web3eth.givenProvider);
        let address = web3eth.givenProvider.selectedAddress;
        console.log("address", address);

        let IDByAddress = await callContract.methods
          .idOfAddress(address)
          .call();

        if (IDByAddress.bankId == 0) {
          setTokenSymbol("EUR");
          setBranchName("Europe Branch");
          let IDByAddress = await callContract.methods
            .idOfAddress(address)
            .call();
          setDetailsBranchID(IDByAddress.branchId);

          let balanceOf = await callContractECB.methods
            .balanceOf(address)
            .call();
          setBalanceBranch(balanceOf);
        } else {
          setTokenSymbol("USD");
          setBranchName("USD Branch");

          let IDByAddress = await callContract.methods
            .idOfAddress(address)
            .call();
          setDetailsBranchID(IDByAddress.branchId);

          let balanceOf = await callContractFED.methods
            .balanceOf(address)
            .call();
          setBalanceBranch(balanceOf);
        }
      }
      setIsConnectButtonClicked(true);
    } catch (error) {
      console.log(Error);
    }
  }

  async function sendForexRequestBank() {
    try {
      if (
        typeof window !== "undefined" &&
        typeof window.ethereum !== "undefined"
      ) {
        const accounts = await window.ethereum.enable();
        console.log("accounts", accounts);
        const provider = await new ethers.providers.Web3Provider(
          window.ethereum
        );
        const signer = await provider.getSigner();
        console.log("Signer", signer);
        const address = await signer.getAddress();
        console.log(address);
      } else {
        console.log("MemtaMask Not Installed Maen");
      }
      const web3eth = new Web3(Web3.givenProvider);

      const callContract = new web3eth.eth.Contract(
        ABIbnksys,
        contractAddressbnksys
      );
      const callContractECB = new web3eth.eth.Contract(
        ABIEcb,
        contractAddressEcb
      );
      const callContractFED = new web3eth.eth.Contract(
        ABIFed,
        contractAddressFed
      );
      if (web3eth.givenProvider) {
        console.log("Hello Provider Here", web3eth.givenProvider);
        let address = web3eth.givenProvider.selectedAddress;
        console.log("address", address);

        let IDByAddress = await callContract.methods
          .idOfAddress(address)
          .call();

        if (IDByAddress.bankId == 0) {
          setTokenSymbol("EUR");

          let forexDetails = await callContract.methods
            .forexDetails(address)
            .call();

          let response = await callContract.methods
            .sendForexRequestToBank(
              IDByAddress.bankId,
              IDByAddress.branchId,
              forexDetails.clientId,
              forexDetails.reqId
            )
            .send({ from: address, gas: 1000000 });
        } else {
          setTokenSymbol("USD");

          let IDByAddress = await callContract.methods
            .idOfAddress(address)
            .call();

          let forexDetails = await callContract.methods
            .forexDetails(address)
            .call();

          let response = await callContract.methods
            .sendForexRequestToBank(
              IDByAddress.bankId,
              IDByAddress.branchId,
              forexDetails.clientId,
              forexDetails.reqId
            )
            .send({ from: address, gas: 1000000 });
        }
      }
    } catch (error) {
      console.log(Error);
    }
  }
  async function processForexRequestBranch() {
    try {
      if (
        typeof window !== "undefined" &&
        typeof window.ethereum !== "undefined"
      ) {
        const accounts = await window.ethereum.enable();
        console.log("accounts", accounts);
        const provider = await new ethers.providers.Web3Provider(
          window.ethereum
        );
        const signer = await provider.getSigner();
        console.log("Signer", signer);
        const address = await signer.getAddress();
        console.log(address);
      } else {
        console.log("MemtaMask Not Installed Maen");
      }
      const web3eth = new Web3(Web3.givenProvider);

      const callContract = new web3eth.eth.Contract(
        ABIbnksys,
        contractAddressbnksys
      );
      const callContractECB = new web3eth.eth.Contract(
        ABIEcb,
        contractAddressEcb
      );
      const callContractFED = new web3eth.eth.Contract(
        ABIFed,
        contractAddressFed
      );
      if (web3eth.givenProvider) {
        console.log("Hello Provider Here", web3eth.givenProvider);
        let address = web3eth.givenProvider.selectedAddress;
        console.log("address", address);

        let IDByAddress = await callContract.methods
          .idOfAddress(address)
          .call();

        let forexDetails = await callContract.methods
          .forexDetails(address)
          .call();

        let IDByAddress2 = await callContract.methods
          .idOfAddress(forexDetails.toClient)
          .call();

        let branchDetails = await callContract.methods
          .branches(IDByAddress2.bankId, IDByAddress2.branchId)
          .call();

        let requestDetails = await callContract.methods
          .requestDetails(forexDetails.byClient, forexDetails.reqId)
          .call();

        if (IDByAddress.bankId == 0) {
          setTokenSymbol("EUR");

          let IDByAddress = await callContract.methods
            .idOfAddress(address)
            .call();

          let forexDetails = await callContract.methods
            .forexDetails(address)
            .call();

          let IDByAddress2 = await callContract.methods
            .idOfAddress(forexDetails.toClient)
            .call();

          let branchDetails = await callContract.methods
            .branches(IDByAddress2.bankId, IDByAddress2.branchId)
            .call();

          let requestDetails = await callContract.methods
            .requestDetails(forexDetails.byClient, forexDetails.reqId)
            .call();

          let responseEcb = await callContractECB.methods
            .approve(contractAddressbnksys, requestDetails.amountInEur)
            .send({ from: address, gas: 1000000 });

          let response = await callContract.methods
            .processForexRequestByBranch(
              requestDetails.toBankId,
              requestDetails.toBranchId,
              requestDetails.fromBankId,
              requestDetails.fromBranchId,
              requestDetails.reqId
            )
            .send({ from: address, gas: 1000000 });

          let requestDetails1 = await callContract.methods
            .requestDetails(forexDetails.byClient, forexDetails.reqId)
            .call();

          let tmp_data = [];
          tmp_data.push(requestDetails1);
          console.log(tmp_data);
          setArrayDataForexDet(tmp_data);
          window.localStorage.setItem("DataFrxDet", JSON.stringify(tmp_data));
          console.log("rrayDataForexDet:", arrayDataForexDet);
          console.log("rrayDataForexDet:", arrayDataForexDet[0].amount);
          console.log("rrayDataForexDet:", arrayDataForexDet[0].bank);
        } else {
          setTokenSymbol("USD");

          let IDByAddress = await callContract.methods
            .idOfAddress(address)
            .call();

          let forexDetails = await callContract.methods
            .forexDetails(address)
            .call();

          let IDByAddress2 = await callContract.methods
            .idOfAddress(forexDetails.toClient)
            .call();

          let branchDetails = await callContract.methods
            .branches(IDByAddress2.bankId, IDByAddress2.branchId)
            .call();

          let requestDetails = await callContract.methods
            .requestDetails(forexDetails.byClient, forexDetails.reqId)
            .call();

          let responseFed = await callContractFED.methods
            .approve(contractAddressbnksys, requestDetails.amountInUsd)
            .send({ from: address, gas: 1000000 });

          let response = await callContract.methods
            .processForexRequestByBranch(
              requestDetails.toBankId,
              requestDetails.toBranchId,
              requestDetails.fromBankId,
              requestDetails.fromBranchId,
              requestDetails.reqId
            )
            .send({ from: address, gas: 1000000 });

          let requestDetails1 = await callContract.methods
            .requestDetails(forexDetails.byClient, forexDetails.reqId)
            .call();

          let tmp_data = [];
          tmp_data.push(requestDetails1);
          console.log("tmp_data", tmp_data);
          setArrayDataForexDet(tmp_data);
          window.localStorage.setItem("DataFrxDet", JSON.stringify(tmp_data));
          console.log("arrayDataForexDet:", arrayDataForexDet[0].amount);
          console.log("arrayDataForexDet:", arrayDataForexDet[0].bank);
        }
      }
    } catch (error) {
      console.log(Error);
    }
  }

  async function checkBorrowRequest() {
    try {
      if (
        typeof window !== "undefined" &&
        typeof window.ethereum !== "undefined"
      ) {
        const accounts = await window.ethereum.enable();
        console.log("accounts", accounts);
        const provider = await new ethers.providers.Web3Provider(
          window.ethereum
        );
        const signer = await provider.getSigner();
        console.log("Signer", signer);
        const address = await signer.getAddress();
        console.log(address);
      } else {
        console.log("MemtaMask Not Installed Maen");
      }
      const web3eth = new Web3(Web3.givenProvider);

      const callContract = new web3eth.eth.Contract(
        ABIbnksys,
        contractAddressbnksys
      );
      const callContractECB = new web3eth.eth.Contract(
        ABIEcb,
        contractAddressEcb
      );
      const callContractFED = new web3eth.eth.Contract(
        ABIFed,
        contractAddressFed
      );
      if (web3eth.givenProvider) {
        console.log("Hello Provider Here", web3eth.givenProvider);
        let address = web3eth.givenProvider.selectedAddress;
        console.log("address", address);

        let IDByAddress = await callContract.methods
          .idOfAddress(address)
          .call();

        if (IDByAddress.bankId == 0) {
          setTokenSymbol("EUR");

          let IDByAddress = await callContract.methods
            .idOfAddress(address)
            .call();

          let borrowDetails = await callContract.methods
            .borrowDetails(address)
            .call();
          console.log("borrowDetails", borrowDetails);

          let positionDetails1 = await callContract.methods
            .positionDetails(borrowDetails.byClient, borrowDetails.positionId)
            .call();

          console.log("positionDetails1", positionDetails1);

          let tmp_data = [];
          tmp_data.push(positionDetails1);
          console.log(tmp_data);
          setArrayBorrowDispDet(tmp_data);
          window.localStorage.setItem(
            "DataBrrDispDet",
            JSON.stringify(tmp_data)
          );
          console.log("arrayData:", arrayData);
          console.log("arrayData:", arrayData[0].isBorrowed);
          console.log("arrayData:", arrayData[0].isDone);
        } else {
          setTokenSymbol("USD");

          let IDByAddress = await callContract.methods
            .idOfAddress(address)
            .call();

          let borrowDetails = await callContract.methods
            .borrowDetails(address)
            .call();
          console.log("borrowDetails", borrowDetails);

          let positionDetails1 = await callContract.methods
            .positionDetails(borrowDetails.byClient, borrowDetails.positionId)
            .call();

          console.log("positionDetails1", positionDetails1);

          let tmp_data = [];
          tmp_data.push(positionDetails1);
          console.log(tmp_data);
          setArrayBorrowDispDet(tmp_data);
          window.localStorage.setItem(
            "DataBrrDispDet",
            JSON.stringify(tmp_data)
          );
          console.log("arrayData:", arrayData);
          console.log("arrayData:", arrayData[0].isBorrowed);
          console.log("arrayData:", arrayData[0].isDone);
        }
      }
    } catch (error) {
      console.log(Error);
    }
  }

  async function processLoan() {
    try {
      if (
        typeof window !== "undefined" &&
        typeof window.ethereum !== "undefined"
      ) {
        const accounts = await window.ethereum.enable();
        console.log("accounts", accounts);
        const provider = await new ethers.providers.Web3Provider(
          window.ethereum
        );
        const signer = await provider.getSigner();
        console.log("Signer", signer);
        const address = await signer.getAddress();
        console.log(address);
      } else {
        console.log("MemtaMask Not Installed Maen");
      }
      const web3eth = new Web3(Web3.givenProvider);

      const callContract = new web3eth.eth.Contract(
        ABIbnksys,
        contractAddressbnksys
      );
      const callContractECB = new web3eth.eth.Contract(
        ABIEcb,
        contractAddressEcb
      );
      const callContractFED = new web3eth.eth.Contract(
        ABIFed,
        contractAddressFed
      );
      if (web3eth.givenProvider) {
        console.log("Hello Provider Here", web3eth.givenProvider);
        let address = web3eth.givenProvider.selectedAddress;
        console.log("address", address);

        let IDByAddress = await callContract.methods
          .idOfAddress(address)
          .call();

        if (IDByAddress.bankId == 0) {
          setTokenSymbol("EUR");

          let IDByAddress = await callContract.methods
            .idOfAddress(address)
            .call();

          let borrowDetails = await callContract.methods
            .borrowDetails(address)
            .call();
          console.log("borrowDetails", borrowDetails);

          let positionDetails = await callContract.methods
            .positionDetails(borrowDetails.byClient, borrowDetails.positionId)
            .call();

          console.log("borrowDetails :", borrowDetails);
          console.log("positionDetails :", positionDetails);

          let responseEcb = await callContractECB.methods
            .approve(contractAddressbnksys, positionDetails.amountBorrowed)
            .send({ from: address, gas: 1000000 });

          let response = await callContract.methods
            .processLoan(
              positionDetails.bankId,
              positionDetails.branchId,
              positionDetails.clientId,
              positionDetails.positionId
            )
            .send({ from: address, gas: 1000000 });

          let positionDetails1 = await callContract.methods
            .positionDetails(borrowDetails.byClient, borrowDetails.positionId)
            .call();

          console.log("positionDetails1", positionDetails1);

          let tmp_data = arrayDataBorrowDispDet;
          tmp_data.push(positionDetails1);
          console.log(tmp_data);
          setArrayBorrowDispDet(tmp_data);
          window.localStorage.setItem(
            "DataBrrDispDet",
            JSON.stringify(tmp_data)
          );
          console.log("arrayData:", arrayData);
          console.log("arrayData:", arrayData[0].isBorrowed);
          console.log("arrayData:", arrayData[0].isDone);
        } else {
          setTokenSymbol("USD");

          let IDByAddress = await callContract.methods
            .idOfAddress(address)
            .call();

          let borrowDetails = await callContract.methods
            .borrowDetails(address)
            .call();
          console.log("borrowDetails", borrowDetails);

          let positionDetails = await callContract.methods
            .positionDetails(borrowDetails.byClient, borrowDetails.positionId)
            .call();

          console.log("borrowDetails :", borrowDetails);
          console.log("positionDetails :", positionDetails);

          let responseFed = await callContractFED.methods
            .approve(contractAddressbnksys, positionDetails.amountBorrowed)
            .send({ from: address, gas: 1000000 });

          let response = await callContract.methods
            .processLoan(
              positionDetails.bankId,
              positionDetails.branchId,
              positionDetails.clientId,
              positionDetails.positionId
            )
            .send({ from: address, gas: 1000000 });

          let positionDetails1 = await callContract.methods
            .positionDetails(borrowDetails.byClient, borrowDetails.positionId)
            .call();

          console.log("positionDetails1", positionDetails1);

          let tmp_data = arrayDataBorrowDispDet;
          tmp_data.push(positionDetails1);
          console.log(tmp_data);
          setArrayBorrowDispDet(tmp_data);
          window.localStorage.setItem(
            "DataBrrDispDet",
            JSON.stringify(tmp_data)
          );
          console.log("arrayData:", arrayData);
          console.log("arrayData:", arrayData[0].isBorrowed);
          console.log("arrayData:", arrayData[0].isDone);
        }
      }
    } catch (error) {
      console.log(Error);
    }
    setIsApprovedButton(true);
  }

  async function approveBorrowRequest() {
    try {
      if (
        typeof window !== "undefined" &&
        typeof window.ethereum !== "undefined"
      ) {
        const accounts = await window.ethereum.enable();
        console.log("accounts", accounts);
        const provider = await new ethers.providers.Web3Provider(
          window.ethereum
        );
        const signer = await provider.getSigner();
        console.log("Signer", signer);
        const address = await signer.getAddress();
        console.log(address);
      } else {
        console.log("MemtaMask Not Installed Maen");
      }
      const web3eth = new Web3(Web3.givenProvider);

      const callContract = new web3eth.eth.Contract(
        ABIbnksys,
        contractAddressbnksys
      );
      const callContractECB = new web3eth.eth.Contract(
        ABIEcb,
        contractAddressEcb
      );
      const callContractFED = new web3eth.eth.Contract(
        ABIFed,
        contractAddressFed
      );
      if (web3eth.givenProvider) {
        console.log("Hello Provider Here", web3eth.givenProvider);
        let address = web3eth.givenProvider.selectedAddress;
        console.log("address", address);

        let IDByAddress = await callContract.methods
          .idOfAddress(address)
          .call();

        if (IDByAddress.bankId == 0) {
          setTokenSymbol("EUR");

          let borrowDetails = await callContract.methods
            .borrowDetails(address)
            .call();
          console.log("borrowDetails", borrowDetails);

          let positionDetails = await callContract.methods
            .positionDetails(borrowDetails.byClient, positionDetails.positionId)
            .call();

          let responseEcb = await callContractECB.methods
            .approve(contractAddressbnksys, positionDetails.amountBorrowed)
            .send({ from: address, gas: 1000000 });
          console.log("Response :", responseEcb);

          let response = await callContract.methods
            .processLoan(
              positionDetails.bankId,
              positionDetails.branchId,
              positionDetails.clientId,
              positionDetails.positionId
            )
            .send({ from: address, gas: 1000000 });
        } else {
          setTokenSymbol("USD");

          let borrowDetails = await callContract.methods
            .borrowDetails(address)
            .call();
          console.log("borrowDetails", borrowDetails);

          let positionDetails = await callContract.methods
            .positionDetails(borrowDetails.byClient, positionDetails.positionId)
            .call();

          let responseFed = await callContractFED.methods
            .approve(contractAddressbnksys, positionDetails.amountBorrowed)
            .send({ from: address, gas: 1000000 });
          console.log("Response :", responseFed);

          let response = await callContract.methods
            .processLoan(
              positionDetails.bankId,
              positionDetails.branchId,
              positionDetails.clientId,
              positionDetails.positionId
            )
            .send({ from: address, gas: 1000000 });
        }
      }
    } catch (error) {
      console.log(Error);
    }
  }

  return (
    <div className="main_page_branch_bg">
      <Breadcrumb className="bredcrumbs_branch">
        <Breadcrumb.Section href="/" link>
          Home
        </Breadcrumb.Section>
        <Breadcrumb.Divider />
        <Breadcrumb.Section active>Branches</Breadcrumb.Section>
      </Breadcrumb>

      <div>
        <Header as="h2" icon textAlign="center">
          <Icon className="icon_branch" name="user circle outline" circular />
          <Header.Content className="header_content_branch">
            {" "}
            Branch
          </Header.Content>
        </Header>
        {/* <Image
                    centered
                    size="medium"
                    src="https://react.semantic-ui.com/images/wireframe/image.png"
                /> */}
      </div>
      <div>
        {" "}
        <Card.Group centered className="card_connect_branch">
          <Card>
            <Card.Content>
              <Card.Meta>Branch ID: {detailsbranchid}</Card.Meta>
              <Card.Description>Branch: {branchname}</Card.Description>
              <Card.Description>
                Balance: {balancebranch / 10e7} {tokenSymbol}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div className="ui two buttons">
                {isconnectbuttonclicked ? (
                  <></>
                ) : (
                  <Button secondary onClick={checkDetails}>
                    Connect
                  </Button>
                )}
              </div>
            </Card.Content>
          </Card>
        </Card.Group>
      </div>
      <Divider />

      <Form unstackable>
        <Form.Group widths={3}>
          <Form.Input
            label="Branch ID"
            placeholder="0."
            type="number"
            value={branchid}
            onChange={(e) => setBranchID(e.target.value)}
          />
          <Form.Input
            label="Client Address"
            placeholder="0x00..."
            type="text"
            value={clientaddress}
            onChange={(e) => setClientAddress(e.target.value)}
          />
          <Form.Input
            label="Amount"
            placeholder="10..."
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Form.Group>

        <Button type="submit" onClick={addClient}>
          Submit
        </Button>
      </Form>
      <Divider />
      <div>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Client Address</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>BankId</Table.HeaderCell>
              <Table.HeaderCell>Client ID</Table.HeaderCell>
              <Table.HeaderCell>Approved</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {arrayData.length > 0 &&
              arrayData.map((data, index) => {
                return (
                  <Table.Row key={index}>
                    <Table.Cell>{data.client}</Table.Cell>
                    <Table.Cell>
                      {data.amount / 10e7} {data.tokenSymbol}
                    </Table.Cell>
                    <Table.Cell>{data.bankId}</Table.Cell>
                    <Table.Cell>{data.branchId}</Table.Cell>
                    <Table.Cell>True</Table.Cell>
                  </Table.Row>
                );
              })}
          </Table.Body>
        </Table>
        <Divider />
      </div>

      <div>
        <div>
          <Accordion>
            <Accordion.Title
              active={isActive === 2}
              index={2}
              onClick={handleClickEventForex}
              className="accordian_title_branch"
            >
              <Icon name="dropdown" />
                Forex
            </Accordion.Title>
            <Divider horizontal/>
            <Accordion.Content active={isActive === 2}>
              <Header as="h2" icon textAlign="center">
                <Icon
                  className="icon_branch"
                  name="wait"
                  circular
                  size="tiny"
                />
                <Header.Content className="header_content_branch">
                  Pending Forex Requests
                </Header.Content>
              </Header>
              <Button primary onClick={checkForexRequest}>
                View Requests
              </Button>
              <Button color="grey" onClick={() => navigate("/forex")}>
                View History
              </Button>

              <Header as="h2" icon textAlign="center">
                {/* <Header.Content>Forex Details</Header.Content> */}
              </Header>
              <Divider horizontal />
              <div>
                <Card.Group centered>
                  {arrayDataForexDet.length > 0 &&
                    arrayDataForexDet.map((data, index) => {
                      return (
                        <Card>
                          <Card.Content>
                            <Icon
                              name="money bill alternate outline"
                              circular
                            />
                            <Card.Header>
                              Forex Request: {data.reqId}{" "}
                            </Card.Header>
                            <Card.Meta>
                              Amount {data.amountInUsd / 10e7} USD
                            </Card.Meta>
                            <Card.Meta>
                              Amount {data.amountInEur / 10e7} EUR
                            </Card.Meta>
                            <Card.Meta>To Bank {data.toBankId}</Card.Meta>
                            <Card.Meta>To Branch {data.toBranchId}</Card.Meta>
                            <Card.Description>
                              EUR/USD={data.amountInUsd / data.amountInEur}
                            </Card.Description>
                            <Button
                              basic
                              color="green"
                              onClick={processForexRequestBranch}
                            >
                              Approve
                            </Button>
                          </Card.Content>
                        </Card>
                      );
                    })}
                </Card.Group>
              </div>

              {/* <Table color="black" key={colors} inverted> */}
              {/* <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>To Client Address</Table.HeaderCell>
                    <Table.HeaderCell>Amount USD</Table.HeaderCell>
                    <Table.HeaderCell>Amount EUR</Table.HeaderCell>
                    <Table.HeaderCell>From Bank</Table.HeaderCell>
                    <Table.HeaderCell>From Branch</Table.HeaderCell>
                    <Table.HeaderCell>To Branch</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                  </Table.Row>
                </Table.Header> */}

              {/* <div>
                  <Grid reversed="computer" columns="equal">
                    <Grid.Row color="black">
                      <Grid.Column>
                        Created at
                        <Grid.Column>2022-06-20 18:53</Grid.Column>
                      </Grid.Column>
                      <Grid.Column>
                        Expected amount
                        <Grid.Column>10397.475 USDT BSC</Grid.Column>
                      </Grid.Column>
                      <Grid.Column>
                        You got
                        <Grid.Column>0 USDT BSC</Grid.Column>
                      </Grid.Column>
                      <Grid.Column>
                        Last Updated
                        <Grid.Column>2022-06-20 18:53</Grid.Column>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row color="black">
                      <Grid.Column>
                        Collateral amount
                        <Grid.Column>1 BTC</Grid.Column>
                      </Grid.Column>
                      <Grid.Column>
                        Liquidation price
                        <Grid.Column>11508.7051 BTC/USDT</Grid.Column>
                      </Grid.Column>
                      <Grid.Column>
                        Monthly interest
                        <Grid.Column>129.9684 USDT</Grid.Column>
                      </Grid.Column>
                      <Grid.Column>
                        Repayment amount
                        <Grid.Column>0 USDT</Grid.Column>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </div> */}

              {/* <Table.Body>
                  {arrayDataForexDet.length > 0 &&
                    arrayDataForexDet.map((data, index) => {
                      // console.log(data[index]);
                      return (
                        <Table.Row key={index}>
                          <Table.Cell>{data.toClient}</Table.Cell>
                          <Table.Cell>{data.amountInUsd / 10e7}USD</Table.Cell>
                          <Table.Cell>{data.amountInEur / 10e7} EUR</Table.Cell>
                          <Table.Cell>{data.fromBankId}</Table.Cell>
                          <Table.Cell>{data.fromBranchId}</Table.Cell>
                          <Table.Cell>{data.toBankId}</Table.Cell>
                          <Table.Cell>{data.toBranchId}</Table.Cell>
                          <Table.Cell>
                            {data.isSentToBank ? (
                              <Icon
                                color="green"
                                name="checkmark"
                                size="large"
                              />
                            ) : (
                              <Icon color="red" name="close" size="large" />
                            )}
                          </Table.Cell>
                          <Table.Cell>
                            {" "}
                            {data.isSentToBank ? (
                              <Button color="green">Approved</Button>
                            ) : (
                              <Button
                                basic
                                color="green"
                                onClick={processForexRequestBranch}
                              >
                                Approve
                              </Button>
                            )}
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                </Table.Body> */}
              {/* </Table> */}

              
            </Accordion.Content>
            <Accordion.Title
              active={isActive === 1}
              index={1}
              onClick={handleClickEventLend}
              className="accordian_title_branch"
            >
              <Icon  name="dropdown" />
                Lending

            </Accordion.Title>
            <Accordion.Content active={isActive === 1}>
              <Header as="h2" icon textAlign="center">
                <Icon className="icon_branch" name="wait" circular />
                <Header.Content className="header_content_branch">
                  Pending Borrow Requests
                </Header.Content>
              </Header>
              <Button primary onClick={checkBorrowRequest}>
                View Requests
              </Button>
              <Button color="grey" onClick={() => navigate("/borrow")}>
                View History
              </Button>
              <Header as="h2" icon textAlign="center"></Header>

              <Card.Group centered>
                {arrayDataBorrowDispDet.length > 0 &&
                  arrayDataBorrowDispDet.map((data, index) => {
                    return (
                      <Card>
                        <Card.Content>
                          <Icon name="handshake outline" circular />
                          <Card.Header>
                            Borrow Request: {data.positionId}{" "}
                          </Card.Header>
                          <Card.Meta>
                            Amount {data.amountBorrowed / 10e7} USD
                          </Card.Meta>
                          <Card.Meta>
                            Status{" "}
                            {data.isDone ? (
                              <Icon
                                color="green"
                                name="checkmark"
                                size="large"
                              />
                            ) : (
                              <Icon color="red" name="close" size="large" />
                            )}
                          </Card.Meta>
                          <Card.Description>
                            Interest Rate {10} %
                          </Card.Description>
                          {data.isDone ? (
                            <Button color="green">
                              Approved
                            </Button>
                          ) : (
                            <Button basic color="green" onClick={processLoan}>
                              Approve
                            </Button>
                          )}
                        </Card.Content>
                      </Card>
                    );
                  })}
              </Card.Group>
              {/* <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Client ID</Table.HeaderCell>
                    <Table.HeaderCell>Amount Borrowed</Table.HeaderCell>
                    <Table.HeaderCell>Branch ID</Table.HeaderCell>
                    <Table.HeaderCell>Position ID</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Approved</Table.HeaderCell>
                  </Table.Row>
                </Table.Header> */}

              {/* <div>
                  <Grid reversed="computer" columns="equal">
                    <Grid.Row color="black">
                      <Grid.Column>
                        Created at
                        <Grid.Column>2022-06-20 18:53</Grid.Column>
                      </Grid.Column>
                      <Grid.Column>
                        Expected amount
                        <Grid.Column>10397.475 USDT BSC</Grid.Column>
                      </Grid.Column>
                      <Grid.Column>
                        You got
                        <Grid.Column>0 USDT BSC</Grid.Column>
                      </Grid.Column>
                      <Grid.Column>
                        Last Updated
                        <Grid.Column>2022-06-20 18:53</Grid.Column>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row color="black">
                      <Grid.Column>
                        Collateral amount
                        <Grid.Column>1 BTC</Grid.Column>
                      </Grid.Column>
                      <Grid.Column>
                        Liquidation price
                        <Grid.Column>11508.7051 BTC/USDT</Grid.Column>
                      </Grid.Column>
                      <Grid.Column>
                        Monthly interest
                        <Grid.Column>129.9684 USDT</Grid.Column>
                      </Grid.Column>
                      <Grid.Column>
                        Repayment amount
                        <Grid.Column>0 USDT</Grid.Column>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </div> */}
              {/* <Table.Body>
                  {arrayDataBorrowDispDet.length > 0 &&
                    arrayDataBorrowDispDet.map((data, index) => {
                      // console.log(data[index]);
                      return (
                        <Table.Row key={index}>
                          <Table.Cell>{data.clientId}</Table.Cell>
                          <Table.Cell>{data.amountBorrowed / 10e7}</Table.Cell>
                          <Table.Cell>{data.branchId}</Table.Cell>
                          <Table.Cell>{data.positionId}</Table.Cell>
                          <Table.Cell>
                            {data.isBorrowed ? "True" : "False"}
                          </Table.Cell>
                          <Table.Cell>
                            {data.isDone ? (
                              <Icon
                                color="green"
                                name="checkmark"
                                size="large"
                              />
                            ) : (
                              <Icon color="red" name="close" size="large" />
                            )}
                          </Table.Cell>
                          <Table.Cell>
                            {" "}
                            {data.isDone ? (
                              <Button color="green">Approved</Button>
                            ) : (
                              <Button basic color="green" onClick={processLoan}>
                                Approve
                              </Button>
                            )}
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                </Table.Body> */}
                
            </Accordion.Content>
          </Accordion>
          <Divider horizontal/>
          <Divider horizontal/>
          <Divider horizontal/>
        </div>
      </div>
    </div>
  );
}
export default Branch;
