import { type ReactNode } from "react";
import { Wrapper } from "./Container.styled";

interface ContainerProps {
  children: ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return <Wrapper>{children}</Wrapper>;
}
