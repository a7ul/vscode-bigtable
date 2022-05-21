import styled from "@emotion/styled";

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  & > :nth-of-type(1) {
    overflow: auto;
    resize: vertical;
  }
  & > :nth-of-type(2) {
    flex-grow: 1;
  }
`;

const Pane = styled.div`
  display: flex;
  min-height: 100px;
`;

export const SplitPane = {
  Container,
  Pane,
};
