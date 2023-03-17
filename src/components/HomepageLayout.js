/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */
import "semantic-ui-css/semantic.min.css";
import { createMedia } from "@artsy/fresnel";
import PropTypes from "prop-types";
import React, { Component, useState } from "react";
import { InView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import Typed from "typed.js";

import Banks from "./Banks";
import "./homepagelayout.css";
import mobilePaymentImage from "../assets/mobile-payment.png";
import bank_img from "../assets/bank_img.jpg";
// import "./graphics.css";

import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Segment,
  Sidebar,
} from "semantic-ui-react";

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
});

const HomepageHeading = ({ mobile }) => (
  <Container text>
    {/* <div className="hhj">46
    <div className="hhj">46</div>
    <div className="hhj">46</div></div>
    <div className="hhj">46</div>
    <div className="hhj">46</div> */}

    {/* <div className="animation-container">
      <div className="y-axis-container">
        <div className="container">
          <div className="flash"></div>
          <div className="coin side">
            <div className="shine_" style="transform:rotate(-30deg);"></div>
          </div>
          <div className="side-coin"></div>
          <div className="coin">
            <div className="dai">
              <div className="inner-dai">
                <div className="inner-inner-dai"></div>
              </div>
              <div className="cutout"></div>
              <div className="dai-shadow"></div>
            </div>
            <div className="shine"></div>
          </div>
        </div>
      </div>
      <div className="shadow"></div>
    </div> */}
    <div className="h1_circle">
      <Header
        as="h1"
        content="Your-Decentralized Banking System"
        inverted
        style={{
          fontSize: mobile ? "2em" : "4em",
          fontWeight: "normal",
          marginBottom: 0,
          marginTop: mobile ? "1.5em" : "3em",
        }}
      />
    </div>
    <div>
      <Image
      style={{color:"red"}}
        src={
          "https://global-uploads.webflow.com/6336e79cd8d43cd4d1230849/63db890c7078928309216caf_hero-img-p-800.png"
        }
      />
    </div>
    <Header
      as="h2"
      content="Trusted and Secure Banking Services."
      inverted
      style={{
        fontSize: mobile ? "1.5em" : "1.7em",
        fontWeight: "normal",
        marginTop: mobile ? "0.5em" : "1.5em",
      }}
    />
  </Container>
);

HomepageHeading.propTypes = {
  mobile: PropTypes.bool,
};

// class MyComponent extends React.Component {
//    constructor(props) {
//      super(props);
//      this.state = { shouldRender: false };
//    }

//    componentDidMount() {
//      // set the state to true after the component has mounted
//      this.setState({ shouldRender: true });
//    }

//    render() {
//      // only render the component if shouldRender is true
//      if (!this.state.shouldRender) {
//        return null;
//      }
//      return (
//        // component's output goes here
//      );
//    }
//  }

class DesktopContainer extends Component {
  constructor(props) {
    super(props);
    this.el = React.createRef();
    this.state = {
      isConnected: false,
      metaAccount: [],
    };
    this.handleClick = this.handleClick.bind(this);
  }

  async handleClick() {
    console.log("Requesting account...");
    if (window.ethereum) {
      console.log("detected");
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(accounts[0]);
        this.setState({ isConnected: true });
        this.setState({ metaAccount: accounts });
      } catch (error) {
        console.log("Error connecting...", error);
        this.setState({ isConnected: false });
      }
    } else {
      console.log("Meta Mask not detected");
    }
  }

  state = {};

  toggleFixedMenu = (inView) => this.setState({ fixed: !inView });

  render() {
    const { isConnected } = this.state;
    const { children } = this.props;
    const { fixed } = this.state;
    return (
      <Media greaterThan="mobile">
        <InView onChange={this.toggleFixedMenu}>
          <Segment
            inverted
            textAlign="center"
            style={{ minHeight: 700, padding: "1em 0em" }}
            vertical
          >
            <Menu
              fixed={fixed ? "top" : null}
              inverted={!fixed}
              pointing={!fixed}
              secondary={!fixed}
              size="large"
            >
              <Image
                className="img_home"
                src={"https://cdn-icons-png.flaticon.com/512/533/533544.png?w=740&t=st=1679050120~exp=1679050720~hmac=5b9113a5960ca287967b02a561ecdedd8e9108d1b4489bb11d7fcc8eefaa09db"}
                size="small"
              />
              <Container>
                <Menu.Item
                  as={Link}
                  to="/bankreserve"
                  style={{
 
                    borderRadius: "20px",
                    with:"2px"
                  }}
                >
                  Reserve Bank
                </Menu.Item>
                <Menu.Item
                  as={Link}
                  to="/banks"
                  style={{
                    background:
                      "linear-gradient(to left, #4040b1 0%, #865dff 100%)",
                    borderRadius: "20px",
                  }}
                >
                  Bank
                </Menu.Item>
                <Menu.Item
                  as={Link}
                  to="/branch"
                  style={{
       
                    borderRadius: "20px",
                  }}
                >
                  Branch
                </Menu.Item>
                <Menu.Item
                  as={Link}
                  to="/banking"
                  style={{
                    background:
                      "linear-gradient(to left, #4040b1 0%, #865dff 100%)",
                    borderRadius: "20px",
                  }}
                >
                  Banking Services
                </Menu.Item>
                <Menu.Item position="right">
                  {isConnected ? (
                    <Button color="blue" style={{ marginLeft: "0.5em" }}>
                      Connected
                    </Button>
                  ) : (
                    <Button
                      as="a"
                      inverted={!fixed}
                      primary
                      style={{ marginLeft: "0.5em" }}
                      onClick={this.handleClick}
                    >
                      Connect Wallet
                    </Button>
                  )}
                </Menu.Item>
              </Container>
            </Menu>
            <HomepageHeading />
          </Segment>
        </InView>

        {children}
      </Media>
    );
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
};

class MobileContainer extends Component {
  state = {};

  handleSidebarHide = () => this.setState({ sidebarOpened: false });

  handleToggle = () => this.setState({ sidebarOpened: true });

  render() {
    const { children } = this.props;
    const { sidebarOpened } = this.state;

    return (
      <Media as={Sidebar.Pushable} at="mobile">
        <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            animation="overlay"
            inverted
            onHide={this.handleSidebarHide}
            vertical
            visible={sidebarOpened}
          >
            <Menu.Item as="a" active>
              Reserve Bank
            </Menu.Item>

            <Menu.Item as="a">Bank</Menu.Item>
            <Menu.Item as="a">Branch</Menu.Item>
            <Menu.Item as="a">Banking Services</Menu.Item>
            <Menu.Item as="a">Connect</Menu.Item>
            {/* <Menu.Item as='a'>Wallet</Menu.Item> */}
          </Sidebar>

          <Sidebar.Pusher dimmed={sidebarOpened}>
            <Segment
              inverted
              textAlign="center"
              style={{ minHeight: 350, padding: "1em 0em" }}
              vertical
            >
              <Container>
                <Menu inverted pointing secondary size="large">
                  <Menu.Item onClick={this.handleToggle}>
                    <Icon name="sidebar" />
                  </Menu.Item>
                  <Menu.Item position="right">
                    <Button as="a" inverted>
                      Connect
                    </Button>
                    <Button as="a" inverted style={{ marginLeft: "0.5em" }}>
                      Connect
                    </Button>
                  </Menu.Item>
                </Menu>
              </Container>
              <HomepageHeading mobile />
            </Segment>

            {children}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Media>
    );
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
};

const ResponsiveContainer = ({ children }) => (
  /* Heads up!
   * For large applications it may not be best option to put all page into these containers at
   * they will be rendered twice for SSR.
   */
  <MediaContextProvider>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </MediaContextProvider>
);

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
};

const HomepageLayout = () => (
  <ResponsiveContainer>
    <Segment style={{ padding: "8em 0em" }} vertical>
      <Grid container stackable verticalAlign="middle">
        <Grid.Row>
          <Grid.Column width={8}>
            <Header as="h3" style={{ fontSize: "2em" }}>
              Join the DeFi revolution...
            </Header>
            <p style={{ fontSize: "1.33em" }}>
              "Our mission is to provide innovative solutions that empower
              people to achieve their goals and improve their lives. We believe
              in the power of technology to create positive change, and we are
              committed to building products that are user-friendly, reliable,
              and secure."
            </p>
            <Header as="h3" style={{ fontSize: "2em", color: "blueviolet" }}>
              "Empowering you to take control of your finances with DeFi."
            </Header>
            <p style={{ fontSize: "1.33em" }}>
              Revolutionizing banking with customization – build and manage your
              own banking ecosystem, transact in any currency, and access
              lending opportunities with ease.
            </p>
          </Grid.Column>
          <Grid.Column floated="right" width={6}>
            <Image
              className="about_img"
              bordered
              rounded
              size="large"
              src="https://global-uploads.webflow.com/63691faa82ea4c4778ce2111/63dbdfe36aa5d7da2b2a47f1_03.%20DeFi%20101%20-%20A%20beginner%E2%80%99s%20guide%20to%20the%20future%20of%20Finance-min-p-1600.png"
            />
          </Grid.Column>
        </Grid.Row>
        <Divider horizontal />
        <Divider horizontal />
        <Grid.Row>
          <Grid.Column floated="left" width={6}>
            <Image
              className="about_img"
              bordered
              rounded
              size="large"
              src="https://global-uploads.webflow.com/63691faa82ea4c4778ce2111/63dbdfb6e0bf5171eebb3361_04.%20Centralized%20Exchanges%20vs%20Decentralized%20Exchanges-min-p-1600.png"
            />
          </Grid.Column>
          <Grid.Column width={8}>
            <Header as="h3" style={{ fontSize: "2em" }}>
              Experience the future of finance with DeFi in rise...
            </Header>
            <p style={{ fontSize: "1.33em" }}>
              "DeFi disrupts finance, offering secure, transparent, and open
              services for all. Built on blockchain, it empowers financial
              innovation and inclusion."
            </p>
            <Header as="h3" style={{ fontSize: "2em", color: "blueviolet" }}>
              "Reducing Dependence on Intermediaries: The Power of DeFi
              Transactions for Customers"
            </Header>
            <p style={{ fontSize: "1.33em" }}>
              DeFi transactions offer customers the advantages of transparency,
              security, and accessibility, enabling financial inclusion and
              innovation while reducing the need for intermediaries.
            </p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
    {/* 
    <Segment style={{ padding: "0em" }} vertical>
      <Grid celled="internally" columns="equal" stackable>
        <Grid.Row textAlign="center">
          <Grid.Column style={{ paddingBottom: "5em", paddingTop: "5em" }}>
            <Header as="h3" style={{ fontSize: "2em" }}>
              "What a Company"
            </Header>
            <p style={{ fontSize: "1.33em" }}>
              That is what they all say about us
            </p>
          </Grid.Column>
          <Grid.Column style={{ paddingBottom: "5em", paddingTop: "5em" }}>
            <Header as="h3" style={{ fontSize: "2em" }}>
              "I shouldn't have gone with their competitor."
            </Header>
            <p style={{ fontSize: "1.33em" }}>
              <Image
                avatar
                src="https://global-uploads.webflow.com/63691faa82ea4c4778ce2111/63dbdfb6e0bf5171eebb3361_04.%20Centralized%20Exchanges%20vs%20Decentralized%20Exchanges-min-p-1600.png"
              />
              <b>Nan</b> Chief Fun Officer Acme Toys
            </p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>

    <Segment style={{ padding: "8em 0em" }} vertical>
      <Container text>
        <Header as="h3" style={{ fontSize: "2em" }}>
          Breaking The Grid, Grabs Your Attention
        </Header>
        <p style={{ fontSize: "1.33em" }}>
          Instead of focusing on content creation and hard work, we have learned
          how to master the art of doing nothing by providing massive amounts of
          gainsborospace and generic content that can seem massive, monolithic
          and worth your attention.
        </p>
        <Button as="a" size="large">
          Read More
        </Button>

        <Divider
          as="h4"
          className="header"
          horizontal
          style={{ margin: "3em 0em", textTransform: "uppercase" }}
        >
          <a href="#">Case Studies</a>
        </Divider>

        <Header as="h3" style={{ fontSize: "2em" }}>
          Did We Tell You About Our Bananas?
        </Header>
        <p style={{ fontSize: "1.33em" }}>
          Yes I know you probably disregarded the earlier boasts as non-sequitur
          filler content, but it's really true. It took years of gene splicing
          and combinatory DNA research, but our bananas can really dance.
        </p>
        <Button as="a" size="large">
          I'm Still Quite Interested
        </Button>
      </Container>
    </Segment> */}

    <Segment inverted vertical style={{ padding: "5em 0em" }}>
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <Header inverted as="h4" content="About" />
              <List link inverted>
                <List.Item as="a">Sitemap</List.Item>
                <List.Item as="a">Contact Us</List.Item>
                <List.Item as="a">Religious Ceremonies</List.Item>
                <List.Item as="a">Gazebo Plans</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header inverted as="h4" content="Services" />
              <List link inverted>
                <List.Item as="a">Banana Pre-Order</List.Item>
                <List.Item as="a">DNA FAQ</List.Item>
                <List.Item as="a">How To Access</List.Item>
                <List.Item as="a">Favorite X-Men</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={7}>
              <Header as="h4" inverted>
                Footer Header
              </Header>
              <p>
                Extra space for a call to action inside the footer that could
                help re-engage users.
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
  </ResponsiveContainer>
);

export function WithRouter(props) {
  const navigate = useNavigate();
  return <Banks navigate={navigate}></Banks>;
}

export default HomepageLayout;
