import styled from "@emotion/styled";

export const List = styled.ol`
  padding: 0 48px 40px;
  list-style: none;
`;

export const Organisation = styled.li`
  list-style: none;
  margin-bottom: 28px;
  padding-left: 20px;
  border-left: 2px solid var(--accent-border);
  position: relative;
  &::before {
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--accent);
    position: absolute;
    left: -5px;
    top: 0px;
  }
`;

export const Company = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  color: var(--title-color);
  font-size: 15.5px;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 4px;
`;

export const About = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 100px;
  background: var(--accent-light);
  border: 1px solid var(--accent-border);
  color: var(--accent-text);
  font-size: 11.5px;
  font-weight: 600;
`;

export const Time = styled.div`
  color: var(--light-color);
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1.5;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

export const Divider = styled.span`
  color: var(--accent-text);
  margin: 0 6px;
`;

export const Item = styled.p`
  color: var(--text-color);
  padding-top: 8px;
  font-size: 14px;
`;
