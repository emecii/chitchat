import { Component } from "react";
import Footer from "../app/Footer";
import Navbar from "../app/Navbar";
import Cover from "./home/Cover"

type Props = {};

type State = {
  content: string;
}

export default class Home extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      content: "home page"
    };
  }

  render() {
    return (
      <>
        <Navbar />
        <Cover />
        <Footer/>
      </>
    );
  }
}