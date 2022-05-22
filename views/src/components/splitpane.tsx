import styled from "@emotion/styled";

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: calc(100vw - 45px);
  & > :nth-of-type(1) {
    overflow: auto;
    resize: vertical;
    flex-shrink: 0;
    max-height: calc(100vh - 200px);
  }
  & > :nth-of-type(2) {
    margin-top: 5px;
    flex-grow: 1;
    overflow: auto;
  }
`;

const Pane = styled.div`
  display: flex;
  min-height: 50px;
`;

export const SplitPane = {
  Container,
  Pane,
};
