import styled from "@emotion/styled";

type Props = {
  height?: number;
  width?: number;
};

export const Spacer = styled.span<Props>`
  width: ${(props) => props.width ?? 0}px;
  height: ${(props) => props.height ?? 0}px;
`;
