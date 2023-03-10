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
  Menu
} from "semantic-ui-react";
import { contractAddressFed, ABIFed } from "../constants";
import { contractAddressEcb, ABIEcb } from "../constants";
import { contractAddressbnksys, ABIbnksys } from "../constants";
import "./borrow.css";
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

  useEffect(() => {
    let temp_data_borrow = window.localStorage.getItem("Borrow_page");
    if (temp_data_borrow) {
      temp_data_borrow = JSON.parse(temp_data_borrow);
      setArrayData(temp_data_borrow);
    }
    // window.localStorage.clear()
  });

  function handleClickEventLend() {
    checkBorrowRequest();
    if (isActive == 1) {
      setIsActive("");
    } else {
      setIsActive(1);
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

          let tmp_data = arrayData;
          tmp_data.push(positionDetails1);
          setArrayData(tmp_data);
          window.localStorage.setItem("Borrow_page", JSON.stringify(tmp_data));
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
          window.localStorage.setItem("Borrow_page", JSON.stringify(tmp_data));
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
          <Icon className="icon_borrow" name="money bill alternate" circular />
          <Header.Content className="header_content_borrow ">
            Borrow History
          </Header.Content>
        </Header>

        <Accordion>
          <Accordion.Title
            active={isActive === 1}
            index={0}
            onClick={handleClickEventLend}
          >
            <Icon className="icon_borrow" name="dropdown" />
            <Header.Content className="header_content_borrow ">
              Borrow
            </Header.Content>
          </Accordion.Title>
          <Accordion.Content active={isActive === 1}>
            {/* <Header as="h2" icon textAlign="center">
                <Icon name="wait" circular size="tiny" />
                <Header.Content>Pending Forex Requests</Header.Content>
              </Header> */}
            {/* <Button secondary onClick={checkForexRequest}>
                View Requests
              </Button> */}
            <Divider horizontal />
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

            <Table color="black" key={colors}>
              {arrayData.length > 0 &&
                arrayData.map((data, index) => {
                  return (
                    <Grid key={index} reversed="computer" columns="equal">
                      <Grid.Row color="white">
                        <Grid.Column>
                          Branch
                          <Grid.Column>{data?.branchId}</Grid.Column>
                        </Grid.Column>
                        <Grid.Column>
                          Expected amount %<Grid.Column>10397.475</Grid.Column>
                        </Grid.Column>
                        <Grid.Column>
                          Amount Borrowed
                          <Grid.Column>
                            {data?.amountBorrowed / 10e7}
                          </Grid.Column>
                        </Grid.Column>
                        <Grid.Column>
                          Last Updated
                          <Grid.Column>{date}</Grid.Column>
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row color="white">
                        <Grid.Column>
                          Approve
                          <Grid.Column>
                            {data?.isDone ? (
                              <Icon
                                color="green"
                                name="checkmark"
                                size="large"
                              />
                            ) : (
                              <Icon color="red" name="close" size="large" />
                            )}
                          </Grid.Column>
                        </Grid.Column>
                        <Grid.Column>
                          Exit
                          <Grid.Column>
                            {" "}
                            {data?.isClear ? (
                              <Icon
                                color="green"
                                name="checkmark"
                                size="large"
                              />
                            ) : (
                              <Icon color="red" name="close" size="large" />
                            )}
                          </Grid.Column>
                        </Grid.Column>
                        <Grid.Column>
                          Borrowed
                          <Grid.Column>
                            {data?.isBorrowed ? (
                              <Icon
                                color="green"
                                name="checkmark"
                                size="large"
                              />
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
                      <Divider />
                    </Grid>
                  );
                })}

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

              {/* {arrayDataF.length > 0 &&
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
                })} */}

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
              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell colSpan="3">
                    <Menu floated="right" pagination>
                      <Menu.Item as="a" icon>
                        <Icon name="chevron left" />
                      </Menu.Item>
                      <Menu.Item as="a">1</Menu.Item>
                      <Menu.Item as="a">2</Menu.Item>
                      <Menu.Item as="a">3</Menu.Item>
                      <Menu.Item as="a">4</Menu.Item>
                      <Menu.Item as="a" icon>
                        <Icon name="chevron right" />
                      </Menu.Item>
                    </Menu>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
          </Accordion.Content>
        </Accordion>
      </div>

      <div></div>
    </div>
  );
}
export default Borrow;
