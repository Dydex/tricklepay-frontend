import { formatTime } from "@/lib/format";
import type { StreamView } from "@/types/stream";

/** Returns whether the connected wallet is allowed to cancel this stream. */
export function canSenderCancel(stream: StreamView, walletAddress: string | null): boolean {
  return Boolean(
    walletAddress &&
      walletAddress === stream.sender &&
      stream.status !== "cancelled" &&
      stream.status !== "completed",
  );
}

// Why a recipient cannot withdraw right now. A cliff is the case worth naming:
// the stream is visibly streaming and its vested figure is climbing, so without
// the date the disabled button looks like a bug rather than a schedule.
export function blockedReason(stream: StreamView): string {
  const now = BigInt(Math.floor(Date.now() / 1000));
  if (now < BigInt(stream.startTime)) {
    return `Starts ${formatTime(stream.startTime)}.`;
  }
  if (now < BigInt(stream.cliffTime)) {
    return `Locked until the cliff on ${formatTime(stream.cliffTime)}.`;
  }
  if (BigInt(stream.withdrawn) >= BigInt(stream.totalAmount)) {
    return "Fully withdrawn.";
  }
  if (stream.cancelled) {
    return "This stream was cancelled.";
  }
  return "Nothing to withdraw yet.";
}
