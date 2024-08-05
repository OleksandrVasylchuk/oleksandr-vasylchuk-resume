import styled from "@emotion/styled";

export const Seitbar = styled.aside`
  /* background: var(--bacgraund-image) no-repeat center center fixed; */
  /* background: rgb(28, 35, 84);
  background: linear-gradient(
    82deg,
    rgba(28, 35, 84, 1) 0%,
    rgba(2, 2, 59, 1) 48%,
    rgba(28, 35, 84, 1) 100%
  ); */
  background: #142227;
  background-size: cover;
  width: 450px;
`;

export const Section = styled.section`
  padding-bottom: 50px;
  padding-left: 50px;
  padding-right: 10px;
`;

export const List = styled.ul``;

export const Title = styled.h3`
  font-size: 36px;
  font-weight: 700;
  line-height: 35px;
  color: var(--white-color);
  margin-bottom: 20px;
`;

export const Item = styled.li`
  font-size: 20px;
  font-weight: 400;
  line-height: 35px;
  color: var(--white-color);
`;

export const Contact = styled.li`
  font-size: 20px;
  font-weight: 400;
  line-height: 30px;
  color: var(--white-color);
  list-style-type: none;
  justify-content: center;
`;

export const Link = styled.a`
  color: var(--white-color);
`;

export const Hi = styled.span`
  margin-right: 10px;
`;

export const Column = styled.div``;

export const Photo = styled.img`
  /* border-radius: 50%; */
  box-shadow: inset 0px 10px 10px 10px var(--main-color);
  width: 350px;
  margin-bottom: 20px;
`;
