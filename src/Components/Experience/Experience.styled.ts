import styled from "@emotion/styled";

export const Main = styled.main`
  flex: 1;
  background: var(--main-bg);
  min-width: 0;
`;

export const Title = styled.h3`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--accent-text);
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 0 48px 20px;
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: var(--border-color);
  }
`;
