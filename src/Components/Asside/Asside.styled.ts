import styled from "@emotion/styled";

export const Seitbar = styled.aside`
  background: var(--sidebar-bg);
  width: 310px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
`;

export const PhotoWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 90px;
    background: linear-gradient(to top, var(--sidebar-bg), transparent);
  }
`;

export const Photo = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1.15;
  object-fit: cover;
  object-position: top center;
  display: block;
`;

export const Column = styled.div``;

export const Section = styled.section`
  padding: 0 26px 28px;
`;

export const Title = styled.h3`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--sidebar-muted);
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const TagList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
  padding: 0;
`;

export const Tag = styled.li`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 100px;
  background: var(--tag-bg);
  border: 1px solid var(--tag-border);
  color: var(--tag-text);
  font-size: 11.5px;
  font-weight: 500;
  list-style: none;
`;

export const Item = styled.li`
  font-size: 13.5px;
  font-weight: 400;
  color: var(--sidebar-text);
  padding: 3px 0 3px 14px;
  list-style: none;
  position: relative;
  &::before {
    content: "\\25B8";
    position: absolute;
    left: 0;
    color: var(--sidebar-accent);
    font-size: 10px;
    top: 5px;
  }
`;

export const Contact = styled.li`
  list-style: none;
`;

export const Link = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--sidebar-text);
  font-size: 13px;
  font-weight: 400;
  padding: 5px 0;
  text-decoration: none;
  transition: color 0.2s ease;
  &:hover {
    color: var(--sidebar-accent);
  }
`;

export const Hi = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(56, 189, 248, 0.12);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--sidebar-accent);
  font-size: 15px;
  flex-shrink: 0;
`;
