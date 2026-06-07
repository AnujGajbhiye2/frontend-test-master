import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Counter from "../index";

describe("Counter Component", () => {
  it("increments the counter value when the button is clicked", async () => {
    render(<Counter />);

    const button = screen.getByRole("button", { name: /count is 0/i });

    // Simulate button clicks and check the updated text
    await userEvent.click(button);
    expect(button).toHaveTextContent("count is 1");

    await userEvent.click(button);
    expect(button).toHaveTextContent("count is 2");
  });
});
