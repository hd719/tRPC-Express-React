import React, { useState } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { trpc } from "./trpc";

import "./index.scss";

// Manages all the caching
const client = new QueryClient(); // Create a client

const AppContent = () => {
  const hello = trpc.useQuery(["hello"]);

  return <div>{JSON.stringify(hello.data)}</div>;
};

const App = () => {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      // url has to be the backend url
      url: "http://localhost:8081/trpc",
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={client}>
      <QueryClientProvider client={client}>
        <AppContent />
      </QueryClientProvider>
    </trpc.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
