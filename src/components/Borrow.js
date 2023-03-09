import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import {
  Header,
  Icon,
  Image,
  Segment,
  Divider,
  Table,
  Breadcrumb,
  Grid,
  Card,
  Accordion,
} from "semantic-ui-react";
import { contractAddressFed, ABIFed } from "../constants";
import { contractAddressEcb, ABIEcb } from "../constants";
import { contractAddressbnksys, ABIbnksys } from "../constants";
import "./bank.css";
const colors = ["black"];

function Borrow() {
  const Web3 = require("web3");
  const ethers = require("ethers");

  const [bankid, setBankID] = useState("");
  const [branchaddress, setBranchAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [centralbankid, setCentralBankID] = useState("");
  const [bankAdded, setBankAdded] = useState(false);
  const [arrayData, setArrayData] = useState([]);
  const [isActive, setIsActive] = useState("");
  const [date, setDate] = useState("");
  function handleClickEventForex() {
    setIsActive(0);
    return;
    const new_index = "";
    if (isActive === 0) {
      setIsActive("");
    }
  }

  function handleClickEventLend() {
    checkBorrowRequest();
    setIsActive(0);
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

          let tmp_data = arrayData;
          tmp_data.push(positionDetails1);
          setArrayData(tmp_data);
          console.log("arrydata", arrayData);
          const unixTimestamp = arrayData[0].timeStamp;
          const date = new Date(unixTimestamp * 1000);
          const humanDate = date.toLocaleString();
          console.log("Humandate:", humanDate);
          setDate(humanDate);
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

          let tmp_data = arrayData;
          tmp_data.push(positionDetails1);
          setArrayData(tmp_data);
          console.log("arrydata", arrayData);
          const unixTimestamp = arrayData[0].timeStamp;
          const date = new Date(unixTimestamp * 1000);
          const humanDate = date.toLocaleString();
          console.log("Humandate:", humanDate);
          setDate(humanDate);
        }
      }
    } catch (error) {
      console.log(Error);
    }
  }

  return (
    <div className="main_page_bg">
      <div>
        <Divider />
        <Header as="h2" icon textAlign="center">
          <Icon name="money bill alternate" circular />
          <Header.Content>Borrow History</Header.Content>
        </Header>

        <Accordion>
          <Accordion.Title
            active={isActive === 0}
            index={0}
            onClick={handleClickEventLend}
          >
            <Icon name="dropdown" />
            Borrow
          </Accordion.Title>
          <Accordion.Content active={isActive === 0}>
            {/* <Header as="h2" icon textAlign="center">
                <Icon name="wait" circular size="tiny" />
                <Header.Content>Pending Forex Requests</Header.Content>
              </Header> */}
            {/* <Button secondary onClick={checkForexRequest}>
                View Requests
              </Button> */}
            <Divider />
            {/* <div>
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
                          </Card.Content>
                        </Card>
                      );
                    })}
                </Card.Group>
              </div> */}

            <Table color="black" key={colors} inverted>
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

              <div>
                <Grid reversed="computer" columns="equal">
                  <Grid.Row color="black">
                    <Grid.Column>
                      Branch
                      <Grid.Column>{arrayData[0]?.branchId}</Grid.Column>
                    </Grid.Column>
                    <Grid.Column>
                      Expected amount %<Grid.Column>10397.475</Grid.Column>
                    </Grid.Column>
                    <Grid.Column>
                      Amount Borrowed
                      <Grid.Column>{arrayData[0]?.amountBorrowed}</Grid.Column>
                    </Grid.Column>
                    <Grid.Column>
                      Last Updated
                      <Grid.Column>{date}</Grid.Column>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row color="black">
                    <Grid.Column>
                      Approve
                      <Grid.Column>
                        {arrayData[0]?.isDone ? (
                          <Icon color="green" name="checkmark" size="large" />
                        ) : (
                          <Icon color="red" name="close" size="large" />
                        )}
                      </Grid.Column>
                    </Grid.Column>
                    <Grid.Column>
                      Exit
                      <Grid.Column>
                        {" "}
                        {arrayData[0]?.isClear ? (
                          <Icon color="green" name="checkmark" size="large" />
                        ) : (
                          <Icon color="red" name="close" size="large" />
                        )}
                      </Grid.Column>
                    </Grid.Column>
                    <Grid.Column>
                      Borrowed
                      <Grid.Column>
                        {arrayData[0]?.isBorrowed ? (
                          <Icon color="green" name="checkmark" size="large" />
                        ) : (
                          <Icon color="red" name="close" size="large" />
                        )}
                      </Grid.Column>
                    </Grid.Column>
                    <Grid.Column>
                      cost
                      <Grid.Column>-</Grid.Column>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </div>

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
            </Table>
          </Accordion.Content>
        </Accordion>
      </div>

      <div></div>
    </div>
  );
}
export default Borrow;
