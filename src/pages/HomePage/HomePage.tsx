import React from "react";
import { Container, Description, Overlay, Title } from "./styledComponents";

const HomePage = () => {
  return (
    <Container>
      <Overlay />
      <Title>
        Welcome to Better Energy Project with Improved Sustainability
      </Title>
      <Description>
        BEPIS is an application designed to empower users to track and manage
        their energy consumption. This innovative tool provides insights and
        tools to help individuals and organizations monitor their energy usage,
        make informed decisions, and contribute to a more sustainable and
        efficient energy future.
      </Description>
    </Container>
  );
};

export default HomePage;
