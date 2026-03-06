import Education from "../Education/Education";
import Absolute from "../Absolute/Absolute";
import Work from "../Work/Work";
import { Main, Title } from "./Experience.styled";

export default function Experience() {
  return (
    <Main>
      <Absolute />

      <Title>Work Experience</Title>
      <Work />

      <Title>Education</Title>
      <Education />
    </Main>
  );
}
