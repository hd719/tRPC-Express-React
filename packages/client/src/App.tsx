import React, { useState } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { trpc } from "./trpc";

import "./index.scss";

// Manages all the caching
const client = new QueryClient(); // Create a client

const AppContent = () => {
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");
  // const hello = trpc.useQuery(["hello"]);
  const getMessages = trpc.useQuery(["messages"]);

  // returns a function
  const sendMessageTRPCFunc = trpc.useMutation(["sendMessage"]);
  const sendMessage = () =>
    sendMessageTRPCFunc.mutate(
      { user, message },
      {
        onSuccess: () => {
          // refetch the messages
          client.invalidateQueries(["messages"]);
        },
      }
    );

  return (
    <>
      <div>
        {getMessages?.data?.map((message) => (
          <div>{message.message}</div>
        ))}
        <div className="mt-10">
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="p-5 border-2 border-gray-300 rounded-lg w-full"
            placeholder="User"
          />
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="p-5 border-2 border-gray-300 rounded-lg w-full"
            placeholder="Message"
          />
        </div>
        <button onClick={sendMessage}>Send Message</button>
      </div>
    </>
  );
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
