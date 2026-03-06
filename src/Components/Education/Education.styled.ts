import styled from "@emotion/styled";

export const List = styled.ol`
  padding: 0 48px 44px;
  list-style: none;
`;

export const Organisation = styled.li`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-color);
  &:last-child {
    border-bottom: none;
  }
`;

export const Company = styled.span`
  color: var(--title-color);
  font-size: 15.5px;
  font-weight: 700;
`;

export const About = styled.p`
  color: var(--accent-text);
  font-size: 13.5px;
  font-weight: 500;
`;

export const Time = styled.p`
  color: var(--light-color);
  font-size: 12.5px;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const Divider = styled.span`
  color: var(--accent-text);
`;
