import React from "react";
import { About, Company, Divider, Time, Organisation, List } from "./Education.styled";

export default function Education() {
  return (
    <List>
      <Organisation>
        <Time>
          <Company>NIZHYN MEDICAL COLLEGE</Company>
        </Time>
        <About>Junior specialist, Emergency medical technician (emergency paramedic)</About>
        <Time>
          2012 - 2015 <Divider>|</Divider> Ukraine
        </Time>
      </Organisation>
      <Organisation>
        <Time>
          <Company>National Pedagogical Dragomanov University</Company>
        </Time>
        <About>Practical Psychologist, Valeologist, and Physical Rehabilitation Specialist (Master's Degree)</About>
        <Time>
          2015 - 2020 <Divider>|</Divider> Ukraine
        </Time>
      </Organisation>
    </List>
  );
}
