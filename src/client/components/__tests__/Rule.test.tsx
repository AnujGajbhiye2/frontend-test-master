import { render, screen } from "@testing-library/react";
import Rule from "../Rule";
import { RuleType } from "@/types/RuleTypes";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

const MOCK_RULE: RuleType = {
  id: "1",
  fieldName: "name",
  operation: "EQUAL",
  value: "",
};

const noop = () => {};

describe("Rule tests", () => {
  it("renders value input for text field", () => {
    render(<Rule rule={MOCK_RULE} onChange={noop} onDelete={noop} submitted={false} />);
    expect(screen.getByPlaceholderText("Value")).toBeInTheDocument();
  });

  it("shows error on blur with empty value", async () => {
    const user = userEvent.setup();
    render(<Rule rule={MOCK_RULE} onChange={noop} onDelete={noop} submitted={false} />);

    const input = screen.getByPlaceholderText("Value");
    await user.click(input);
    await user.tab();

    expect(screen.getByText("Value is required")).toBeInTheDocument();
  });

  it("calls onDelete when delete button clicked", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();

    render(<Rule rule={MOCK_RULE} onChange={noop} onDelete={onDelete} submitted={false} />);

    await user.click(screen.getByRole("button"));
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it("shows error when submitted=true", () => {
    render(<Rule rule={MOCK_RULE} onChange={noop} onDelete={noop} submitted={true} />);
    expect(screen.getByText("Value is required")).toBeInTheDocument();
  });
});
