import { render, screen } from "@testing-library/react";
import ValueWidget from "../ValueWidget";
import { RuleType } from "@/types/RuleTypes";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

const noop = () => {};
const mockSetError = vi.fn();

describe("Value Widget Tests", () => {
  it("renders amount input and currency select for amount field", () => {
    const rule: RuleType = {
      id: "1",
      fieldName: "amount",
      operation: "EQUAL",
      value: { amount: 10, currency: "USD" },
    };

    render(<ValueWidget rule={rule} onChange={noop} error={null} setError={mockSetError} />);

    expect(screen.getByPlaceholderText("Amount")).toBeInTheDocument();
  });

  it("renders transaction state value field for transaction_state fieldname", () => {
    const rule: RuleType = {
      id: "1",
      fieldName: "transaction_state",
      operation: "EQUAL",
      value: "ERROR",
    };

    render(<ValueWidget rule={rule} onChange={noop} error={null} setError={mockSetError} />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("ERROR")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("renders numeric input for installments field", () => {
    const rule: RuleType = {
      id: "1",
      fieldName: "installments",
      operation: "EQUAL",
      value: 2,
    };

    render(<ValueWidget rule={rule} onChange={noop} error={null} setError={mockSetError} />);

    expect(screen.getByPlaceholderText("Value")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Value")).toHaveAttribute("type", "number");
  });

  it("renders text input for any other fieldname like name", () => {
    const rule: RuleType = {
      id: "1",
      fieldName: "name",
      operation: "EQUAL",
      value: "Anuj",
    };

    render(<ValueWidget rule={rule} onChange={noop} error={null} setError={mockSetError} />);

    expect(screen.getByPlaceholderText("Value")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Value")).toHaveAttribute("type", "text");
  });

  it("applies error border when error is present", () => {
    const rule: RuleType = { id: "1", fieldName: "name", operation: "EQUAL", value: "" };

    render(
      <ValueWidget rule={rule} onChange={noop} error="Value is required" setError={mockSetError} />,
    );

    expect(screen.getByPlaceholderText("Value")).toHaveClass("border-destructive");
  });

  it("calls setError on amount input blur", async () => {
    const user = userEvent.setup();
    const rule: RuleType = {
      id: "1",
      fieldName: "amount",
      operation: "EQUAL",
      value: { amount: 0, currency: "USD" },
    };

    render(<ValueWidget rule={rule} onChange={noop} error={null} setError={mockSetError} />);

    await user.click(screen.getByPlaceholderText("Amount"));
    await user.tab();

    expect(mockSetError).toHaveBeenCalled();
  });

  it("calls onChange when text input changes", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const rule: RuleType = { id: "1", fieldName: "name", operation: "EQUAL", value: "" };

    render(<ValueWidget rule={rule} onChange={onChange} error={null} setError={mockSetError} />);

    await user.type(screen.getByPlaceholderText("Value"), "test");

    expect(onChange).toHaveBeenCalled();
  });
});
