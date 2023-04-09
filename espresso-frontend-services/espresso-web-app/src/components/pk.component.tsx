import { Component } from "react";
import Footer from "../app/Footer";
import Game from "./pk/Game"
import styled from "styled-components"

type Props = {};

type State = {
  content: string;
}

const PKPageWrapper = styled.div`
  padding-top: 60px;
`

export default class Pk extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      content: "pk page"
    };
  }

  render() {
    return (
      <PKPageWrapper>
        <Game userId={"test1"}/>
        <Footer />
      </PKPageWrapper>
    );
  }
}