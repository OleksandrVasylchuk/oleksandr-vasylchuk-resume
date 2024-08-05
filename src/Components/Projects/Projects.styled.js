import styled from "@emotion/styled";

export const Experience = styled.li`
  margin-top: 20px;
`;

export const Dots = styled.span`
  color: var(--main-color);
  font-weight: 100;
`;

export const Name = styled.span`
  color: var(--light-color);
  font-weight: 400;
  padding-left: 20px;
`;

export const Link = styled.a`
  color: var(--title-color);
  font-size: 22px;
  font-weight: 700;
  margin-right: 20px;
  &:nth-child(2n + 1) {
    display: inline-flex;
    min-width: 149px;
  }
`;

export const Submenu = styled.p`
  color: var(--main-color);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`;

export const List = styled.ol`
  color: rgb(21, 4, 83);
  /* border-bottom: medium dashed var(--title-color); */
`;

export const Bold = styled.b``;
