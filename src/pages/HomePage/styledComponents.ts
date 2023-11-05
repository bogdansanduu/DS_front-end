import styled from "styled-components";
import background from "../../assets/images/home_background.jpg";
import { Typography } from "@mui/material";

export const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url(${background});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
  }
`;

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(93, 93, 93, 0.15);
  z-index: 1;
`;

export const Title = styled(Typography)`
  color: white;
  font-weight: bold;
  z-index: 2;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  font-size: 50px;
`;

export const Description = styled(Typography)`
  color: white;
  z-index: 2;
  text-align: center;
  max-width: 1000px;
  margin-top: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  font-size: 25px;
`;
