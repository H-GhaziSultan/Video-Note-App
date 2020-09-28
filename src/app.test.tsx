import React from "react";
import { render } from "@testing-library/react";
import App from "./app";

test("renders the welcome text", () => {
  const { getByText } = render(<App />);
  const text = getByText(/Dashboard/i);
  expect(text).toBeInTheDocument();
});
