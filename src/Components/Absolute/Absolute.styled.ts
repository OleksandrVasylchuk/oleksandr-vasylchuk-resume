import styled from "@emotion/styled";

export const Absolute = styled.div`
  padding: 44px 48px 36px;
`;

export const Column = styled.div``;

export const Name = styled.h1`
  font-size: 40px;
  font-weight: 800;
  line-height: 1.1;
  color: var(--title-color);
  letter-spacing: -1.5px;
  margin-bottom: 6px;
`;

export const Job = styled.h2`
  font-size: 13px;
  font-weight: 600;
  color: var(--accent-text);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 20px;
`;

export const Target = styled.p`
  color: var(--text-color);
  font-size: 14px;
  font-weight: 400;
  line-height: 1.75;
  margin-bottom: 24px;
`;

export const Highlights = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const HighlightTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 5px 14px;
  border-radius: 100px;
  background: var(--accent-light);
  border: 1px solid var(--accent-border);
  color: var(--accent-text);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
`;
