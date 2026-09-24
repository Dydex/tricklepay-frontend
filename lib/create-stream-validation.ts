import { isValidContractAddress, isValidStellarAddress, parseAmount, toUnix } from "@/lib/validation";

// Field-level validation for the create-stream form. Each rule returns the
// message to show under its field, or undefined when the value is fine (or not
// yet complete enough to judge). Pure, so they can be tested without React.

export function recipientFieldError(value: string): string | undefined {
  return value && !isValidStellarAddress(value)
    ? "Must be a valid G... or C... Stellar address."
    : undefined;
}

export function tokenFieldError(value: string): string | undefined {
  return value && !isValidContractAddress(value)
    ? "Must be a valid C... contract address."
    : undefined;
}

export function amountFieldError(value: string): string | undefined {
  if (!value) return undefined;
  try {
    return parseAmount(value) <= 0n ? "Amount must be greater than zero." : undefined;
  } catch (err) {
    return err instanceof Error ? err.message : "Invalid amount.";
  }
}

export function endFieldError(start: string, end: string): string | undefined {
  return start && end && toUnix(end) <= toUnix(start) ? "End must be after start." : undefined;
}

export function cliffFieldError(start: string, end: string, cliff: string): string | undefined {
  if (!start || !end || !cliff) return undefined;
  const c = toUnix(cliff);
  return c < toUnix(start) || c > toUnix(end)
    ? "Cliff must fall between start and end."
    : undefined;
}
