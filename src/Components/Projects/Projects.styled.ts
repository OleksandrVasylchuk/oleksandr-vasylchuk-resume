import styled from "@emotion/styled";

export const Experience = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
`;

export const LinkGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
`;

export const Dots = styled.span`
  color: var(--accent-text);
  font-weight: 100;
`;

export const Name = styled.span`
  display: block;
  color: var(--light-color);
  font-weight: 500;
  font-style: normal;
  font-size: 11.5px;
  margin: 2px 0 4px;
  letter-spacing: 0.3px;
`;

export const Link = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 6px;
  background: #f8fafc;
  color: var(--title-color);
  font-size: 12.5px;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid var(--border-color);
  transition: all 0.15s ease;
  &:hover {
    background: var(--accent-light);
    border-color: var(--accent-border);
    color: var(--accent-text);
  }
`;

export const Submenu = styled.p`
  color: var(--text-color);
  font-size: 13.5px;
  font-weight: 400;
  line-height: 1.65;
  margin-top: 4px;
`;

export const List = styled.ol`
  list-style: none;
`;

export const Bold = styled.b`
  color: var(--accent-text);
  font-weight: 400;
  font-style: normal;
`;
