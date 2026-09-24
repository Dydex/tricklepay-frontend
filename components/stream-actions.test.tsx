import { describe, expect, it } from "vitest";

import type { StreamView } from "@/types/stream";

import { canSenderCancel } from "./stream-actions";

const stream = {
  id: "1",
  sender: "G-SENDER",
  recipient: "G-RECIPIENT",
  status: "streaming",
} as StreamView;

describe("canSenderCancel", () => {
  it("allows the sender to cancel an active stream", () => {
    expect(canSenderCancel(stream, stream.sender)).toBe(true);
  });

  it("does not allow the recipient to cancel", () => {
    expect(canSenderCancel(stream, stream.recipient)).toBe(false);
  });

  it("does not allow cancellation after completion", () => {
    expect(canSenderCancel({ ...stream, status: "completed" }, stream.sender)).toBe(false);
  });
});
