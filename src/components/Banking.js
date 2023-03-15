//Need to fix the amount in the card
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Form,
  Header,
  Segment,
  Icon,
  Image,
  Divider,
  Card,
  Breadcrumb,
  Table,
  Grid,
  List,
  Container,
  Tab,
  Menu,
  Message
} from "semantic-ui-react";
import { contractAddressFed, ABIFed } from "../constants";
import { contractAddressEcb, ABIEcb } from "../constants";
import { contractAddressbnksys, ABIbnksys } from "../constants";
import "./banking.css";
const colors = ["black"];

const Web3 = require("web3");
const ethers = require("ethers");

function Banking() {
  const [frombankid, setFromBankID] = useState(""); // Taken from call metamask
  const [frombranchid, setFromBranchkID] = useState("");
  const [tobankid, setToBankid] = useState("");
  const [tobranchid, setToBranchid] = useState("");
  const [clientaddress, setClientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [tokensymbol, setTokenSymbol] = useState("");
  const [arrayDataF, setArrayDataF] = useState([]);
  const [arrayDataBr, setArrayDataBr] = useState([]);
  const [arrayDataloan, setArrayDataLoan] = useState([]);
  const [arrayDataloanDet, setArrayDataLoanDet] = useState([]);
  const [isconnected, setIsConnected] = useState(false);
  const [isExit, setIsExit] = useState(false);
  const [clientName, setClientName] = useState("");
  const [bankName, setBankName] = useState("");
  const [checkClient, setCheckClient] = useState("");
  const [isCorrAcc, setIsCorrAcc] = useState(false);

  useEffect(() => {
    // someForexDets()
    checkDetails();

    let temp_dataF = window.localStorage.getItem("DataF");
    if (temp_dataF) {
      temp_dataF = JSON.parse(temp_dataF);
      setArrayDataF(temp_dataF);
    }

    let temp_dataBr = window.localStorage.getItem("DataBr");
    if (temp_dataBr) {
      temp_dataBr = JSON.parse(temp_dataBr);
      setArrayDataBr(temp_dataBr);
    }

    let temp_dataLoan = window.localStorage.getItem("DataLoan");
    if (temp_dataLoan) {
      temp_dataLoan = JSON.parse(temp_dataLoan);
      setArrayDataLoan(temp_dataLoan);
    }

    let temp_dataLoan_Det = window.localStorage.getItem("DataLoanDet");
    if (temp_dataLoan_Det) {
      temp_dataLoan_Det = JSON.parse(temp_dataLoan_Det);
      setArrayDataLoanDet(temp_dataLoan_Det);
    }

    getAddress();

    // window.localStorage.clear();
  }, [arrayDataF, arrayDataBr, arrayDataloan]);

  async function checkDetails() {
    try {
      if (
        typeof window !== "undefined" &&
        typeof window.ethereum !== "undefined"
      ) {
        const accounts = await window.ethereum.enable();
        // console.log("accounts", accounts);
        const provider = await new ethers.providers.Web3Provider(
          window.ethereum
        );
        const signer = await provider.getSigner();
        // console.log("Signer", signer);
        const address = await signer.getAddress();
        // console.log(address);
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
        // console.log("Hello Provider Here", web3eth.givenProvider);
        let address = web3eth.givenProvider.selectedAddress;
        // console.log("address", address);

        const formattedMetamaskAddress =
          web3eth.utils.toChecksumAddress(address);

        let IDByAddress = await callContract.methods
          .idOfAddress(address)
          .call();

        let branchAddress = await callContract.methods
          .clients(IDByAddress.bankId, IDByAddress.branchId)
          .call();

        if (branchAddress.client === formattedMetamaskAddress) {
          setIsCorrAcc(true);
          if (IDByAddress.bankId == 0) {
            let IDByAddress = await callContract.methods
              .idOfAddress(address)
              .call();

            let branchAddress = await callContract.methods
              .branches(IDByAddress.bankId, IDByAddress.branchId)
              .call();
          } else {
            let IDByAddress = await callContract.methods
              .idOfAddress(address)
              .call();

            let balanceOf = await callContractFED.methods
              .balanceOf(address)
              .call();
          }
        } else {
          setIsCorrAcc(false);
        }
      }
    } catch (error) {
      console.log(Error);
    }
  }

  async function getAddress() {
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
        // console.log("Signer", signer);
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
      if (web3eth.givenProvider) {
        // console.log("Hello Provider Here", web3eth.givenProvider);
        let address = web3eth.givenProvider.selectedAddress;
        console.log("address", address);

        let numOfRequest = await callContract.methods
          .numOfRequest(address)
          .call();

        let ReqDetailsClient1 = await callContract.methods
          .requestDetails(address, numOfRequest - 1)
          .call();

        if (
          "0x64ad7de63C4ed0fBEF948DC04574E781740ABF90" ==
          "0x64ad7de63C4ed0fBEF948DC04574E781740ABF90"
        ) {
          console.log("Do something");
        } else {
          window.alert("Not a Client, Please Change Account");
          return;
        }
      }
    } catch (error) {
      console.log(Error);
    }
  }

  async function someForexDets() {
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

          let numOfRequest = await callContract.methods
            .numOfRequest(address)
            .call();

          let ReqDetailsClient1 = await callContract.methods
            .requestDetails(address, numOfRequest - 1)
            .call();

          let tmp_data = arrayDataF;
          tmp_data.push(ReqDetailsClient1);
          console.log(tmp_data);
          setArrayDataF(tmp_data);
          window.localStorage.setItem("DataF", JSON.stringify(tmp_data));
        } else {
          setTokenSymbol("USD");

          let IDByAddress = await callContract.methods
            .idOfAddress(address)
            .call();

          let numOfRequest = await callContract.methods
            .numOfRequest(address)
            .call();

          let ReqDetailsClient1 = await callContract.methods
            .requestDetails(address, numOfRequest - 1)
            .call();

          let tmp_data = arrayDataF;
          tmp_data.push(ReqDetailsClient1);
          console.log(tmp_data);
          setArrayDataF(tmp_data);
          window.localStorage.setItem("DataF", JSON.stringify(tmp_data));
        }
      }
    } catch (error) {
      console.log(Error);
    }
  }

  async function forex() {
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

        let IDByAddress2 = await callContract.methods
          .idOfAddress(clientaddress)
          .call();

        console.log(
          "IDByAddress.bankId, IDByAddress.branchId,IDByAddress.clientId, IDByAddress2.bankId, IDByAddress2.branchId, clientaddress, amount:",
          IDByAddress.bankId,
          IDByAddress.branchId,
          IDByAddress.clientId,
          IDByAddress2.bankId,
          IDByAddress2.branchId,
          clientaddress,
          amount
        );

        if (IDByAddress.bankId == 0) {
          setTokenSymbol("EUR");
          let responseEcb = await callContractECB.methods
            .approve(contractAddressbnksys, amount * 100000000)
            .send({ from: address, gas: 1000000 });

          let IDByAddress = await callContract.methods
            .idOfAddress(address)
            .call();

          let IDByAddress2 = await callContract.methods
            .idOfAddress(clientaddress)
            .call();

          let response = await callContract.methods
            .forexRequestToBranchOfBank1(
              IDByAddress.bankId,
              IDByAddress.branchId,
              IDByAddress.clientId,
              IDByAddress2.bankId,
              IDByAddress2.branchId,
              clientaddress,
              amount * 100000000
            )
            .send({ from: address, gas: 1000000 });

          let numOfRequest = await callContract.methods
            .numOfRequest(address)
            .call();

          let ReqDetailsClient1 = await callContract.methods
            .requestDetails(address, numOfRequest - 1)
            .call();

          console.log("Response from addbank:", numOfRequest);
          console.log("call bank:", ReqDetailsClient1);

          let tmp_data = arrayDataF;
          tmp_data.push(ReqDetailsClient1);
          console.log(tmp_data);
          setArrayDataF(tmp_data);
          window.localStorage.setItem("DataF", JSON.stringify(tmp_data));
          console.log("arrayDataF:", arrayDataF);
          console.log("arrayDataF:", arrayDataF[0].amount);
          console.log("arrayDataF:", arrayDataF[0].bank);
        } else {
          setTokenSymbol("USD");

          let responseFed = await callContractFED.methods
            .approve(contractAddressbnksys, amount * 10e8)
            .send({ from: address, gas: 1000000 });
          console.log("Response :", responseFed);

          let IDByAddress = await callContract.methods
            .idOfAddress(address)
            .call();

          let IDByAddress2 = await callContract.methods
            .idOfAddress(clientaddress)
            .call();

          let response = await callContract.methods
            .forexRequestToBranchOfBank2(
              IDByAddress.bankId,
              IDByAddress.branchId,
              IDByAddress.clientId,
              IDByAddress2.bankId,
              IDByAddress2.branchId,
              clientaddress,
              amount * 100000000
            )
            .send({ from: address, gas: 1000000 });

          let numOfRequest = await callContract.methods
            .numOfRequest(address)
            .call();

          let ReqDetailsClient1 = await callContract.methods
            .requestDetails(address, numOfRequest - 1)
            .call();

          console.log("ReqDetailsAddress :", numOfRequest);
          console.log("ReqDetailsClient1 :", ReqDetailsClient1);

          // response = {addres: hhkujiiio, status: true, id:555, amount:8885454}
          let tmp_data = arrayDataF;
          tmp_data.push(ReqDetailsClient1);
          console.log("tmp_data", tmp_data);
          setArrayDataF(tmp_data);
          window.localStorage.setItem("DataF", JSON.stringify(tmp_data));
          console.log("arrayDataF:", arrayDataF[0].amount);
          console.log("arrayDataF:", arrayDataF[0].bank);
        }
      }
    } catch (error) {
      console.log(Error);
    }
  }

  async function borrow() {
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

          console.log("amount!!!!!!!!!!!:", amount);

          let response = await callContract.methods
            .borrowRequest(
              IDByAddress.bankId,
              IDByAddress.clientId,
              amount * 100000000
            )
            .send({ from: address, gas: 1000000 });

          let numOfPosition = await callContract.methods
            .numOfPosition(address)
            .call();

          let positionDetails = await callContract.methods
            .positionDetails(address, numOfPosition - 1)
            .call();

          console.log("numOfPosition:", numOfPosition);
          console.log("positionDetails:", positionDetails);

          let tmp_data = arrayDataBr;
          console.log("Array DataBr:", arrayDataBr);
          // tmp_data.pop(); Do we need to pop here as this is only setting the values once, meaning called only once
          tmp_data.push(positionDetails);
          console.log(tmp_data);
          setArrayDataBr(tmp_data);
          window.localStorage.setItem("DataBr", JSON.stringify(tmp_data));
          console.log(
            "arradata bank:",
            arrayDataBr[arrayDataBr.length - 1].bankId
          );
          if (arrayDataBr[arrayDataBr.length - 1].bankId == 0) {
            setBankName("Europe Bank");
          } else {
            setBankName("USD Bank");
          }
        } else {
          setTokenSymbol("USD");

          let IDByAddress = await callContract.methods
            .idOfAddress(address)
            .call();

          let response = await callContract.methods
            .borrowRequest(
              IDByAddress.bankId,
              IDByAddress.clientId,
              amount * 100000000
            )
            .send({ from: address, gas: 1000000 });

          let numOfPosition = await callContract.methods
            .numOfPosition(address)
            .call();

          let positionDetails = await callContract.methods
            .positionDetails(address, numOfPosition - 1)
            .call();

          console.log("numOfPosition :", numOfPosition);
          console.log("positionDetails :", positionDetails);

          // response = {addres: hhkujiiio, status: true, id:555, amount:8885454}
          let tmp_data = arrayDataBr;
          console.log("Array DataBr:", arrayDataBr);
          tmp_data.push(positionDetails);
          console.log("tmp_data", tmp_data);
          setArrayDataBr(tmp_data);
          window.localStorage.setItem("DataBr", JSON.stringify(tmp_data));
          console.log(
            "arrayDataloan:",
            arrayDataBr[arrayDataBr.length - 1].bankId
          );
          if (arrayDataBr[arrayDataBr.length - 1].bankId == 0) {
            setBankName("Europe Bank");
          } else {
            setBankName("USD Bank");
          }
        }
      }
    } catch (error) {
      console.log(Error);
    }
  }

  async function clearLoan() {
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

          let branchAddress = await callContract.methods
            .branches(IDByAddress.bankId, IDByAddress.branchId)
            .call();

          let borrowDetails = await callContract.methods
            .borrowDetails(branchAddress.branch)
            .call();

          let positionDetails = await callContract.methods
            .positionDetails(borrowDetails.byClient, borrowDetails.positionId)
            .call();

          let calculateNumOfDays = await callContract.methods
            .calculateNumOfDays(
              IDByAddress.bankId,
              IDByAddress.branchId,
              positionDetails.positionId
            )
            .call();

          let responseEcb = await callContractECB.methods
            .approve(contractAddressbnksys, positionDetails.amountBorrowed)
            .send({ from: address, gas: 1000000 });
          console.log("Response :", responseEcb);

          let response = await callContract.methods
            .clearLoan(
              positionDetails.bankId,
              positionDetails.branchId,
              positionDetails.positionId,
              positionDetails.clientId
            )
            .send({ from: address, gas: 1000000 });

          let positionDetails1 = await callContract.methods
            .positionDetails(borrowDetails.byClient, borrowDetails.positionId)
            .call();

          let tmp_data_br = arrayDataBr;
          console.log("Array DataBr:", arrayDataBr);
          tmp_data_br.pop();
          tmp_data_br.push(positionDetails1);
          console.log(tmp_data_br);
          setArrayDataBr(tmp_data_br);
          window.localStorage.setItem("DataBr", JSON.stringify(tmp_data_br));

          // let tmp_data = arrayDataloan;
          // tmp_data.push(positionDetails);
          // console.log(tmp_data);
          // setArrayDataLoan(tmp_data);
          // window.localStorage.setItem("DataLoan", JSON.stringify(tmp_data));
          // console.log("arrayDataloan:", arrayDataloan);
          // console.log("arrayDataloan:", arrayDataloan[0].amount);
          // console.log("arrayDataloan:", arrayDataloan[0].bank);
        } else {
          setTokenSymbol("USD");

          let IDByAddress = await callContract.methods
            .idOfAddress(address)
            .call();

          let branchAddress = await callContract.methods
            .branches(IDByAddress.bankId, IDByAddress.branchId)
            .call();

          let borrowDetails = await callContract.methods
            .borrowDetails(branchAddress.branch)
            .call();
          console.log("borrowDetails", borrowDetails);

          let positionDetails = await callContract.methods
            .positionDetails(borrowDetails.byClient, borrowDetails.positionId)
            .call();

          let calculateNumOfDays = await callContract.methods
            .calculateNumOfDays(
              positionDetails.bankId,
              positionDetails.branchId,
              positionDetails.positionId
            )
            .call();

          let responseFed = await callContractFED.methods
            .approve(contractAddressbnksys, positionDetails.amountBorrowed)
            .send({ from: address, gas: 1000000 });
          console.log("Response :", responseFed);

          let response = await callContract.methods
            .clearLoan(
              positionDetails.bankId,
              positionDetails.branchId,
              positionDetails.positionId,
              positionDetails.clientId
            )
            .send({ from: address, gas: 1000000 });

          let positionDetails1 = await callContract.methods
            .positionDetails(borrowDetails.byClient, borrowDetails.positionId)
            .call();

          let tmp_data_br = arrayDataBr;
          console.log("Array DataBr:", arrayDataBr);
          tmp_data_br.pop();
          tmp_data_br.push(positionDetails1);
          console.log(tmp_data_br);
          setArrayDataBr(tmp_data_br);
          window.localStorage.setItem("DataBr", JSON.stringify(tmp_data_br));

          // let tmp_data = arrayDataloan;
          // tmp_data.push(positionDetails);
          // console.log(tmp_data);
          // setArrayDataLoan(tmp_data);
          // window.localStorage.setItem("DataLoan", JSON.stringify(tmp_data));
          // console.log("arrayDataloan:", arrayDataloan);
          // console.log("arrayDataloan:", arrayDataloan[0].amount);
          // console.log("arrayDataloan:", arrayDataloan[0].bank);
        }
      }
    } catch (error) {
      console.log(Error);
    }
    setIsExit(true);
  }

  async function giveDetails() {
    try {
      setIsConnected(true);
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
          setClientName("Europe Client");

          let IDByAddress = await callContract.methods
            .idOfAddress(address)
            .call();

          let borrowDetails = await callContract.methods
            .borrowDetails(address)
            .call();
          console.log("borrowDetails", borrowDetails);

          let positionDetails = await callContract.methods
            .positionDetails(borrowDetails.byClient, positionDetails.positionId)
            .call();

          let calculateNumOfDays = await callContract.methods
            .calculateNumOfDays(
              IDByAddress.bankId,
              IDByAddress.branchId,
              positionDetails.positionId
            )
            .call();

          console.log("positionDetails", positionDetails);

          let tmp_data = arrayDataloanDet;
          tmp_data.push(positionDetails);
          console.log(tmp_data);
          setArrayDataLoanDet(tmp_data);
          window.localStorage.setItem("DataLoanDet", JSON.stringify(tmp_data));
          console.log("arrayDataloan:", arrayDataloan);
          console.log("arrayDataloan:", arrayDataloan[0].amount);
          console.log("arrayDataloan:", arrayDataloan[0].bank);
        } else {
          setTokenSymbol("USD");
          setClientName("USD Client");

          let IDByAddress = await callContract.methods
            .idOfAddress(address)
            .call();

          let borrowDetails = await callContract.methods
            .borrowDetails(address)
            .call();
          console.log("borrowDetails", borrowDetails);

          let positionDetails = await callContract.methods
            .positionDetails(borrowDetails.byClient, positionDetails.positionId)
            .call();

          let calculateNumOfDays = await callContract.methods
            .calculateNumOfDays(
              IDByAddress.bankId,
              IDByAddress.branchId,
              positionDetails.positionId
            )
            .call();

          let tmp_data = arrayDataloanDet;
          tmp_data.push(positionDetails);
          console.log(tmp_data);
          setArrayDataLoanDet(tmp_data);
          window.localStorage.setItem("DataLoanDet", JSON.stringify(tmp_data));
          console.log("arrayDataloan:", arrayDataloan);
          console.log("arrayDataloan:", arrayDataloan[0].amount);
          console.log("arrayDataloan:", arrayDataloan[0].bank);
        }
      }
    } catch (error) {
      console.log(Error);
    }
  }

  return (
    <>
      {isCorrAcc ? (
        <div className="banking_page_bg">
          <div>
            <Menu pagination>
              <Menu.Item as={Link} to="/">
                Home
              </Menu.Item>
              <Menu.Item as={Link} to="/banks">
                Bank
              </Menu.Item>
              <Menu.Item as={Link} to="/branch">
                Branch
              </Menu.Item>
              <Menu.Item as={Link} to="/banking">
                Client
              </Menu.Item>
            </Menu>

            <Divider horizontal />

            {isconnected ? (
              <></>
            ) : (
              <Button className="button_banking" primary onClick={giveDetails}>
                Connect
              </Button>
            )}

            {isconnected ? (
              <Card centered>
                <Image
                  src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
                  wrapped
                  ui={false}
                />
                <Card.Content>
                  <Card.Header>{clientName}</Card.Header>

                  <Card.Meta>
                    <span className="date">client ID: {0}</span>
                  </Card.Meta>
                </Card.Content>
                <Card.Content extra>
                  <a>
                    <Icon name="money bill alternate outline" />
                    {1000} EUR
                  </a>
                </Card.Content>
              </Card>
            ) : (
              <></>
            )}
          </div>
          <Divider horizontal />

          <Tab
            menu={{ pointing: true }}
            panes={[
              {
                menuItem: "Forex",
                render: () => (
                  <Tab.Pane attached={false}>
                    <div>
                      <Header as="h2" icon textAlign="center">
                        <Icon className="icon_banking" name="money" circular />
                        <Header.Content className="icon_banking">
                          Forex{" "}
                        </Header.Content>
                      </Header>
                    </div>

                    <Form unstackable>
                      <Form.Group widths={2}>
                        <Form.Input
                          label="Reciever Address"
                          placeholder="0xfsc257d..."
                          type="text"
                          value={clientaddress}
                          onChange={(e) => setClientAddress(e.target.value)}
                        />
                        <Form.Input
                          label="Amount"
                          placeholder="10"
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </Form.Group>

                      {/* {centralbankid ? <Button type="submit" onClick={addbank()}>Submit</Button> :<div>Ereor</div> } */}
                      <Button type="submit" onClick={forex}>
                        Submit
                      </Button>
                    </Form>
                    <Divider hidden />
                    <div>
                      <Header as="h2" icon textAlign="center">
                        <Header.Content className="header_content_forex">
                          Forex Statement{" "}
                        </Header.Content>
                      </Header>

                      <Table color="black" key={colors}>
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell>
                              Receiver Address
                            </Table.HeaderCell>
                            <Table.HeaderCell>Amount USD</Table.HeaderCell>
                            <Table.HeaderCell>Amount EUR</Table.HeaderCell>
                            <Table.HeaderCell>Req ID</Table.HeaderCell>
                            <Table.HeaderCell>Approved</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>

                        <Table.Body>
                          {arrayDataF.length > 0 &&
                            arrayDataF.map((data, index) => {
                              console.log(data[index]);
                              return (
                                <Table.Row key={index}>
                                  <Table.Cell>{data.toClient}</Table.Cell>
                                  <Table.Cell>
                                    {data.amountInUsd / 10e7} USD
                                  </Table.Cell>
                                  <Table.Cell>
                                    {data.amountInEur / 10e7} EUR
                                  </Table.Cell>
                                  <Table.Cell>{data.reqId}</Table.Cell>
                                  <Table.Cell>
                                    {data.isDepositedToBranch ? (
                                      <Icon
                                        color="green"
                                        name="checkmark"
                                        size="large"
                                      />
                                    ) : (
                                      <Icon
                                        color="red"
                                        name="close"
                                        size="large"
                                      />
                                    )}
                                  </Table.Cell>
                                  <Table.Cell>
                                    {data.isDone ? (
                                      <Icon
                                        color="green"
                                        name="checkmark"
                                        size="large"
                                      />
                                    ) : (
                                      <Icon
                                        color="red"
                                        name="close"
                                        size="large"
                                      />
                                    )}
                                  </Table.Cell>
                                </Table.Row>
                              );
                            })}

                          {/* false displayed for data.isDOne as initially forexrequest put a false in the local store now when i rretrie it gives the same old result  */}
                        </Table.Body>
                      </Table>
                    </div>

                    <Divider horizontal />
                    <Divider horizontal />
                    <Divider horizontal />
                    <Divider horizontal />
                    <Divider horizontal />
                    <Divider horizontal />
                    <Divider horizontal />
                    <Divider horizontal />
                    <Divider horizontal />
                    <Divider horizontal />
                    <Divider horizontal />
                    <Divider horizontal />
                    <Divider horizontal />
                    <Divider horizontal />
                    <Divider horizontal />
                    <Divider horizontal />
                    <Divider horizontal />
                    <Divider horizontal />
                  </Tab.Pane>
                ),
              },
              {
                menuItem: "Lending",
                render: () => (
                  <Tab.Pane attached={false}>
                    {" "}
                    <div>
                      <Header as="h2" icon textAlign="center">
                        <Icon
                          className="header_content_forex"
                          name="handshake outline"
                          circular
                        />
                        <Header.Content className="header_content_forex">
                          Lending{" "}
                        </Header.Content>
                      </Header>
                    </div>
                    <Form unstackable>
                      <Form.Group widths={2}>
                        <Form.Input
                          label="Branch Name"
                          placeholder="0"
                          type="text"
                        />
                        <Form.Input
                          label="Amount"
                          placeholder="10..."
                          type="text"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </Form.Group>

                      <Button type="submit" onClick={borrow}>
                        Submit
                      </Button>
                    </Form>
                    <Divider horizontal />
                    <Divider horizontal />
                    <Divider horizontal />
                    <Divider horizontal />
                    <div>
                      <Header as="h2" icon textAlign="center">
                        <Header.Content className="header_content_forex">
                          Lending Statement{" "}
                        </Header.Content>
                      </Header>

                      <Table color="black" key={colors}>
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell>Borrowed Amount</Table.HeaderCell>
                            <Table.HeaderCell>Bank Name</Table.HeaderCell>
                            <Table.HeaderCell>Client Name</Table.HeaderCell>
                            <Table.HeaderCell>Position ID</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell>Clear Loan</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>

                        <Table.Body>
                          {arrayDataBr.length > 0 &&
                            arrayDataBr.map((data, index) => {
                              return (
                                <Table.Row key={index}>
                                  <Table.Cell>
                                    {data.amountBorrowed / 10e7}
                                  </Table.Cell>
                                  <Table.Cell>
                                    {data.bankId == 0
                                      ? "Europe Bank"
                                      : "USD Bank"}
                                  </Table.Cell>
                                  <Table.Cell>
                                    {data.bankId == 0 && data.clientId
                                      ? "Europe Client"
                                      : "USD Client"}
                                  </Table.Cell>
                                  <Table.Cell>{data.positionId}</Table.Cell>
                                  <Table.Cell>
                                    {data.isBorrowed ? "True" : "False"}
                                  </Table.Cell>
                                  {data.isClear ? (
                                    <Icon
                                      color="green"
                                      name="checkmark"
                                      size="large"
                                    />
                                  ) : (
                                    <Button
                                      basic
                                      color="green"
                                      onClick={clearLoan}
                                    >
                                      Exit
                                    </Button>
                                  )}
                                </Table.Row>
                              );
                            })}
                        </Table.Body>
                      </Table>
                    </div>
                    <Divider horizontal />
                    <Divider horizontal />
                    <Divider horizontal />
                    <Divider horizontal />
                    <Divider horizontal />
                    <Divider horizontal />
                    <Divider horizontal />
                    <Divider horizontal />
                    <Divider horizontal />
                    <Divider horizontal />
                    <Divider horizontal />
                    <Divider horizontal />
                    <Divider horizontal />
                  </Tab.Pane>
                ),
              },
            ]}
          />

          {/* <div>
    <Header as="h2" icon textAlign="center">
      <Icon className="icon_banking" name="money" circular />
      <Header.Content className="icon_banking">Forex </Header.Content>
    </Header>
  </div> */}

          {/* <Form unstackable>
    <Form.Group widths={2}>
      <Form.Input
        label="Reciever Address"
        placeholder="0xfsc257d..."
        type="text"
        value={clientaddress}
        onChange={(e) => setClientAddress(e.target.value)}
      />
      <Form.Input
        label="Amount"
        placeholder="10"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
    </Form.Group>

    <Button type="submit" onClick={forex}>
      Submit
    </Button>
  </Form>
  <Divider hidden /> */}

          {/* <div>
    <Header as="h2" icon textAlign="center">
      <Header.Content className="header_content_forex">
        Forex Statement{" "}
      </Header.Content>
    </Header>

    <Table color="black" key={colors}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Receiver Address</Table.HeaderCell>
          <Table.HeaderCell>Amount USD</Table.HeaderCell>
          <Table.HeaderCell>Amount EUR</Table.HeaderCell>
          <Table.HeaderCell>Req ID</Table.HeaderCell>
          <Table.HeaderCell>Approved</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {arrayDataF.length > 0 &&
          arrayDataF.map((data, index) => {
            console.log(data[index]);
            return (
              <Table.Row key={index}>
                <Table.Cell>{data.toClient}</Table.Cell>
                <Table.Cell>{data.amountInUsd / 10e7} USD</Table.Cell>
                <Table.Cell>{data.amountInEur / 10e7} EUR</Table.Cell>
                <Table.Cell>{data.reqId}</Table.Cell>
                <Table.Cell>
                  {data.isDepositedToBranch ? (
                    <Icon color="green" name="checkmark" size="large" />
                  ) : (
                    <Icon color="red" name="close" size="large" />
                  )}
                </Table.Cell>
                <Table.Cell>
                  {data.isDone ? (
                    <Icon color="green" name="checkmark" size="large" />
                  ) : (
                    <Icon color="red" name="close" size="large" />
                  )}
                </Table.Cell>
              </Table.Row>
            );
          })}

        false displayed for data.isDOne as initially forexrequest put a false in the local store now when i rretrie it gives the same old result 
      </Table.Body>
    </Table>
  </div>
  <Divider />  */}

          {/* <div>
    <Header as="h2" icon textAlign="center">
      <Icon
        className="header_content_forex"
        name="handshake outline"
        circular
      />
      <Header.Content className="header_content_forex">
        Lending{" "}
      </Header.Content>
    </Header>
  </div> */}

          {/* <Form unstackable>
    <Form.Group widths={2}>
      <Form.Input label="Branch ID" placeholder="0" type="text" />
      <Form.Input
        label="Amount"
        placeholder="10..."
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
    </Form.Group>


    <Button type="submit" onClick={borrow}>
      Submit
    </Button>
  </Form> */}
          {/* <Divider horizontal />
  <Divider horizontal />
  <Divider horizontal />
  <Divider horizontal /> */}

          {/* <div>
    <Header as="h2" icon textAlign="center">
      <Header.Content className="header_content_forex">
        Lending Statement{" "}
      </Header.Content>
    </Header>

    <Table color="black" key={colors}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Borrowed Amount</Table.HeaderCell>
          <Table.HeaderCell>Bank ID</Table.HeaderCell>
          <Table.HeaderCell>Client ID</Table.HeaderCell>
          <Table.HeaderCell>Position ID</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
          <Table.HeaderCell>Clear Loan</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {arrayDataBr.length > 0 &&
          arrayDataBr.map((data, index) => {
            console.log(data[index]);
            return (
              <Table.Row key={index}>
                <Table.Cell>{data.amountBorrowed / 10e7}</Table.Cell>
                <Table.Cell>{data.bankId}</Table.Cell>
                <Table.Cell>{data.clientId}</Table.Cell>
                <Table.Cell>{data.positionId}</Table.Cell>
                <Table.Cell>
                  {data.isBorrowed ? "True" : "False"}
                </Table.Cell>
                {data.isClear ? (
                  <Icon color="green" name="checkmark" size="large" />
                ) : (
                  <Button basic color="green" onClick={clearLoan}>
                    Exit
                  </Button>
                )}
              </Table.Row>
            );
          })}


      </Table.Body>
    </Table>
  </div>
  <Divider horizontal />
  <Divider horizontal />
  <Divider horizontal />
  <Divider horizontal />
  <Divider horizontal />
  <Divider horizontal />
  <Divider horizontal />
  <Divider horizontal />
  <Divider horizontal /> */}

          {/* <div>
    <Divider horizontal />

    <Segment
      className="banking_footer"
      inverted
      vertical
      style={{ padding: "0em 0em" }}
    >
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <Header inverted as="h4" content="About" />
              <List link inverted>
                <List.Item as="a">Sitemap</List.Item>
                <List.Item as="a">Contact Us</List.Item>
                <List.Item as="a">Crypto meets</List.Item>
                <List.Item as="a">Future Plans</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header inverted as="h4" content="Services" />
              <List link inverted>
                <List.Item as={Link} to="/banking">
                  Decentralized Forex
                </List.Item>
                <List.Item as="a">Lending</List.Item>
                <List.Item as="a">Transfer</List.Item>
                <List.Item as="a"> Token Swap</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header as="h4" inverted>
                Trust and Security
              </Header>
              <p>
                We Served Our Customer Since The start of the Blockchain
                Technology.
              </p>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header as="h4" inverted>
                Trust and Security
              </Header>
              <p>
                We Served Our Customer Since The start of the Blockchain
                Technology.
              </p>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header as="h4" inverted>
                Trust and Security
              </Header>
              <p>
                We Served Our Customer Since The start of the Blockchain
                Technology.
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
  </div> */}
        </div>
      ) : (
        <Message icon>
          <Icon name="circle notched" loading />
          <Message.Content>
            <Message.Header>Wrong Account!!!</Message.Header>
            Please Change Your Account
          </Message.Content>
        </Message>
      )}
    </>
  );
}
export default Banking;

// <Form.Group widths={2}>
// <Form.Input label="Bank Adress" placeholder="0xfsc257d..." type="text"
//   value={bankaddress}
//   onChange={(e) => setClientAddress(e.target.value)} />
// <Form.Input label="Amount" placeholder="10" type="text"
//   value={amount}
//   onChange={(e) => setAmount(e.target.value)} />
// <Form.Input label="Central Bank ID" placeholder="0" type="text"
//   value={centralbankid}
//   onChange={(e) => setCentralBankID(e.target.value)} />
// </Form.Group>
