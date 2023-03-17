import React from "react";
import { useEffect } from "react";
import { useState } from "react";

import {
  Header,
  Icon,
  Divider,
  Table,
  Grid,
  Accordion,
} from "semantic-ui-react";
import { contractAddressFed, ABIFed } from "../constants";
import { contractAddressEcb, ABIEcb } from "../constants";
import { contractAddressbnksys, ABIbnksys } from "../constants";
import ReactPaginate from "react-paginate";
import "./forex.css";
const colors = ["green"];

function Forex() {
  const Web3 = require("web3");
  const ethers = require("ethers");

  const [branchName, setBranchName] = useState("");
  const [detailsBranchID, setDetailsBranchID] = useState("");
  const [balanceBranch, setBalanceBranch] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [isconnectbuttonclicked, setIsConnectButtonClicked] = useState("");
  const [bankAdded, setBankAdded] = useState(false);
  const [arrayData, setArrayData] = useState([]);
  const [isActive, setIsActive] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [addNew, setAddNew] = useState(false);
  const [pushCounter, setPushCounter] = useState(0);

  const displayDetails = 3;
  const pageVisited = pageNumber * displayDetails;

  useEffect(() => {
    // localStorage.removeItem("Forex_page");

    let temp_data_forex = window.localStorage.getItem("Forex_page");
    if (temp_data_forex) {
      temp_data_forex = JSON.parse(temp_data_forex);
      setArrayData(temp_data_forex);
    }
    // window.localStorage.clear()
  });

  function handleClickEventForex() {
    checkDetails();
    if (isActive == 2) {
      setIsActive("");
    } else {
      setIsActive(2);
    }
  }

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const dispDets =
    arrayData.length > 0 &&
    arrayData
      ?.slice(pageVisited, pageVisited + displayDetails)
      .map((data, index) => {
        return (
          <Grid key={index} reversed="computer" columns="equal">
            <Grid.Row color="gainsboro">
              <Grid.Column>
                Amount USD
                <Grid.Column>{data?.amountInUsd / 10e7}</Grid.Column>
              </Grid.Column>
              <Grid.Column>
                Amount EUR
                <Grid.Column>{data?.amountInEur / 10e7}</Grid.Column>
              </Grid.Column>
              <Grid.Column>
                To Client
                <Grid.Column>{data?.toClient?.slice(0, 6)}...</Grid.Column>
              </Grid.Column>
              <Grid.Column>
                From Client
                <Grid.Column>{data?.byClient?.slice(0, 6)}...</Grid.Column>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row color="gainsboro">
              <Grid.Column>
                Done
                <Grid.Column>
                  {data?.isDone ? (
                    <Icon color="green" name="checkmark" size="large" />
                  ) : (
                    <Icon color="red" name="close" size="large" />
                  )}
                </Grid.Column>
              </Grid.Column>
              <Grid.Column>
                Deposited to Branch
                <Grid.Column>
                  {data?.isDepositedToBranch ? (
                    <Icon color="green" name="checkmark" size="large" />
                  ) : (
                    <Icon color="red" name="close" size="large" />
                  )}
                </Grid.Column>
              </Grid.Column>
              <Grid.Column>
                Forex Rate
                <Grid.Column>129.9684 EUR/USD</Grid.Column>
              </Grid.Column>
              <Grid.Column>
                Branch name
                <Grid.Column>{branchName}</Grid.Column>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        );
      });

  async function checkDetails() {
    try {
      setAddNew(true);
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

          let forexDetails = await callContract.methods
            .forexDetails(address)
            .call();
          console.log("forexDetails", forexDetails);

          let ReqDetailsClient1 = await callContract.methods
            .requestDetails(forexDetails.byClient, forexDetails.reqId)
            .call();

          console.log("ReqDetailsClient1", ReqDetailsClient1);

          let tmp_data = arrayData;

          tmp_data.push(ReqDetailsClient1);
          setPushCounter(pushCounter + 1);

          if (pushCounter == 2) {
            tmp_data.pop();
            tmp_data.pop();
            setPushCounter(0);
          }
          setArrayData(tmp_data);
          console.log("arrayData1", arrayData);
          window.localStorage.setItem("Forex_page", JSON.stringify(tmp_data));
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

          let forexDetails = await callContract.methods
            .forexDetails(address)
            .call();
          console.log("forexDetails", forexDetails);

          let ReqDetailsClient1 = await callContract.methods
            .requestDetails(forexDetails.byClient, forexDetails.reqId)
            .call();

          console.log("ReqDetailsClient1", ReqDetailsClient1);

          let tmp_data = arrayData;

          tmp_data.push(ReqDetailsClient1);
          setPushCounter(pushCounter + 1);

          if (pushCounter == 2) {
            tmp_data.pop();
            setPushCounter(0);
          }
          setArrayData(tmp_data);
          window.localStorage.setItem("Forex_page", JSON.stringify(tmp_data));
        }
      }
      setIsConnectButtonClicked(true);
    } catch (error) {
      console.log(Error);
    }
  }

  return (
    <div className="main_page_bg">
      <div>
        <Divider />
        <Header as="h2" icon textAlign="center">
          <Icon className="icon_forex" name="money bill alternate" circular />
          <Header.Content className="header_content_forex">
            Forex History
          </Header.Content>
        </Header>

        <Accordion>
          <Accordion.Title
            active={isActive === 2}
            index={0}
            onClick={handleClickEventForex}
          >
            <Icon className="icon_forex" name="dropdown"></Icon>
            <Header.Content className="header_content_forex">
              Forex
            </Header.Content>
          </Accordion.Title>
          <Accordion.Content active={isActive === 2}>
            <Divider />

            <Table color="black" key={colors}>
              {dispDets}

              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={arrayData.length / 3}
                onPageChange={changePage}
                containerClassName={"paginationBttns"}
                previousLinkClassName={"previousBttn"}
                nextLinkClassName={"nextBttn"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
              ></ReactPaginate>
            </Table>
          </Accordion.Content>
        </Accordion>
      </div>

      <div></div>
    </div>
  );
}
export default Forex;
