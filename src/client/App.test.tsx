import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import App from "./App";

it("renders submit and reset buttons", () => {
  render(<App />);
  expect(screen.getByRole("button", { name: "Submit Query" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
});

it("shows placeholder when no query submitted", () => {
  render(<App />);
  expect(screen.getByText("Submit query to see JSON output")).toBeInTheDocument();
});

it("shows JSON output after valid submit", async () => {
  const user = userEvent.setup();
  render(<App />);

  const input = screen.getByPlaceholderText("Value");
  await user.type(input, "test");
  await user.click(screen.getByRole("button", { name: "Submit Query" }));

  expect(screen.getByText("Query JSON")).toBeInTheDocument();
});

it("blocks submit and shows no JSON when rule is invalid", async () => {
  const user = userEvent.setup();
  render(<App />);

  
  await user.click(screen.getByRole("button", { name: "Submit Query" }));

  expect(screen.queryByText("Query JSON")).not.toBeInTheDocument();
});

it("resets state when Reset clicked", async () => {
  const user = userEvent.setup();
  render(<App />);

  const input = screen.getByPlaceholderText("Value");
  await user.type(input, "test");
  await user.click(screen.getByRole("button", { name: "Submit Query" }));
  expect(screen.getByText("Query JSON")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Reset" }));
  expect(screen.queryByText("Query JSON")).not.toBeInTheDocument();
});
