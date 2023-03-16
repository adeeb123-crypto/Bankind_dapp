/* This to be fixed in addbranch banks.call needs to be changed */

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
  Menu,
  Message,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { contractAddressFed, ABIFed } from "../constants";
import { contractAddressEcb, ABIEcb } from "../constants";
import { contractAddressbnksys, ABIbnksys } from "../constants";
import "./bank.css";
const colors = ["black"];

function Banks() {
  const Web3 = require("web3");
  const ethers = require("ethers");

  const [bankid, setBankID] = useState("");
  const [branchaddress, setBranchAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [centralbankid, setCentralBankID] = useState("");
  const [bankAdded, setBankAdded] = useState(false);
  const [arrayData, setArrayData] = useState([]);
  const [isCorrAcc, setIsCorrAcc] = useState(false);

  useEffect(() => {
    checkDetails();
    if (bankAdded) {
      setBankAdded(true);
    } else {
      setBankAdded(false);
    }

    let temp_data = window.localStorage.getItem("DataB");
    if (temp_data) {
      temp_data = JSON.parse(temp_data);
      setArrayData(temp_data);
    }

    // window.localStorage.clear()
  }, [arrayData]);
  async function addbranch() {
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

        if (bankid == "Europe Bank") {
          setTokenSymbol("EUR");
          let responseEcb = await callContractECB.methods
            .approve(contractAddressbnksys, amount * 100000000)
            .send({ from: address, gas: 1000000 });
          let response = await callContract.methods
            .addBranch(0, branchaddress, amount * 100000000, "EUR")
            .send({ from: address, gas: 1000000 });
          console.log("Response from addbank:", response);

          let branchCount1 = await callContract.methods.branchCount(0).call();

          let branchdetails1 = await callContract.methods
            .branches(0, branchCount1 - 1)
            .call();

          console.log("Response from addbank:", branchCount1);
          console.log("call bank:", branchdetails1);

          let tmp_data = arrayData;
          tmp_data.push(branchdetails1);
          console.log(tmp_data);
          setArrayData(tmp_data);
          window.localStorage.setItem("DataB", JSON.stringify(tmp_data));
          console.log("arrayData:", arrayData);
          console.log("arrayData:", arrayData[0].amount);
          console.log("arrayData:", arrayData[0].bank);
        } else {
          setTokenSymbol("USD");
          let responseFed = await callContractFED.methods
            .approve(contractAddressbnksys, amount * 100000000)
            .send({ from: address, gas: 1000000 });
          console.log("Response :", responseFed);
          let response = await callContract.methods
            .addBranch(1, branchaddress, amount * 100000000, "USD")
            .send({ from: address, gas: 1000000 });
          console.log(response);

          let branchCount2 = await callContract.methods.branchCount(1).call();

          let branchdetails2 = await callContract.methods
            .branches(1, branchCount2 - 1)
            .call();

          console.log("Response from addbank:", branchCount2);
          console.log("call bank:", branchdetails2);

          let tmp_data = arrayData;
          tmp_data.push(branchdetails2);
          console.log(tmp_data);
          setArrayData(tmp_data);
          window.localStorage.setItem("DataB", JSON.stringify(tmp_data));
          console.log("arrayData:", arrayData);
          // console.log("arrayData:", arrayData[0].amount);
          // console.log("arrayData:", arrayData[0].bank);
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
          .branches(IDByAddress.bankId, IDByAddress.branchId)
          .call();

        if (branchAddress.bank === formattedMetamaskAddress) {
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

  return (
    <>
      {isCorrAcc ? (
        <>
          <div className="main_page_bg">
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
            <Divider horizontal/>
            <Divider horizontal/>
            <Divider horizontal/>
            <Divider horizontal/>
            <Divider horizontal/>
            <Divider horizontal/>
            <div>
              <Header as="h2" icon textAlign="center">
                {/* <Icon className="icon_banks" name="building outline" circular /> */}
                <Header.Content className="header_content_bank">
                  {" "}
                  BANK
                </Header.Content>
              </Header>
            </div>

            <div>
              <Form unstackable>
                <Form.Group widths={2}>
                  <Form.Input
                    label="Branch Address"
                    placeholder="0xfsc257d..."
                    type="text"
                    value={branchaddress}
                    onChange={(e) => setBranchAddress(e.target.value)}
                  />
                  <Form.Input
                    label="Amount"
                    placeholder="1000..."
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <Form.Input
                    label="Bank Name"
                    placeholder="0"
                    type="text"
                    value={bankid}
                    onChange={(e) => setBankID(e.target.value)}
                  />
                </Form.Group>

                <Button primary type="submit" onClick={addbranch}>
                  Submit
                </Button>
              </Form>
            </div>

            <Divider horizontal />
            <div>
              <Table color="black" key={colors}>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Branch Address</Table.HeaderCell>
                    <Table.HeaderCell>Amount</Table.HeaderCell>
                    <Table.HeaderCell>Approved</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {arrayData.length > 0 &&
                    arrayData.map((data, index) => {
                      console.log(data[index]);
                      return (
                        <Table.Row key={index}>
                          <Table.Cell>{data.branch.slice(0,6)+"..."+data.branch.slice(36,42)}</Table.Cell>
                          <Table.Cell>
                            {data.amount / 10e7} {data.tokenSymbol}
                          </Table.Cell>
                          <Table.Cell>
                            {data.status ? "True" : "True"}
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                </Table.Body>
              </Table>
            </div>

            <div>
              {/* <Segment inverted>
    <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
    <Divider inverted />

  </Segment> */}
            </div>
          </div>
        </>
      ) : (
        <div className="acc_msg_box">
        <Message icon>
          <Icon name="circle notched" loading />
          <Message.Content>
            <Message.Header>Wrong Account!!!</Message.Header>
            Please Change Your Account
          </Message.Content>
        </Message>
        </div>
      )}
    </>
  );
}
export default Banks;
