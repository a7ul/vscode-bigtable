import styled from "@emotion/styled";
import React, { useContext, useEffect, useState } from "react";
import { client } from "../../../utils/messages";
import { QueryPageContext } from "../hooks/QueryPageContext";
import { Colors, Padding } from "../styling";

const Container = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const ResultView = styled.code`
  background: ${Colors.grey};
  flex: 1;
  color: white;
  display: flex;
  padding: ${Padding.medium}px;
`;

export function Results() {
  const [results, setResults] = useState<string>();
  const ctx = useContext(QueryPageContext);
  useEffect(() => {
    async function main() {
      if (!ctx) {
        return;
      }
      const results = await client.request("getRows", {
        projectId: ctx.projectId,
        instanceId: ctx.instanceId,
        tableId: ctx.tableId,
      });
      setResults(JSON.stringify(results));
    }
    main().catch((err) => console.error(err));
  }, []);
  return (
    <Container>
      <ResultView>
        {results ??
          `
          {
            "name": "John"
          }
          `}
      </ResultView>
    </Container>
  );
}
