import React from "react";
import {
  About,
  Company,
  Divider,
  Time,
  Organisation,
  List,
} from "./AdditionalEducation.styled";

export default function Education() {
  return (
    <List>
      <Organisation>
        <Time>
          <Company>GoIT Academy</Company>
        </Time>
        <About>FullStack developer</About>
        <Time>
          2020 - 2021 <Divider>|</Divider> Ukraine
        </Time>
      </Organisation>
    </List>
  );
}
