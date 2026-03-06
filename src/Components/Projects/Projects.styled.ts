import styled from "@emotion/styled";

export const Experience = styled.li`
  margin-top: 5px;
`;

export const Dots = styled.span`
  color: var(--main-color);
  font-weight: 100;
`;

export const Name = styled.span`
  color: var(--light-color);
  font-weight: 400;
  font-style: italic;
`;

export const Link = styled.a`
  color: var(--title-color);
  font-size: 16px;
  font-weight: 700;
  margin-right: 20px;
  &:nth-child(2n + 1) {
    display: inline-flex;
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
`;

export const Bold = styled.b``;
