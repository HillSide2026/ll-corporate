/**
 * Declares which version of the LL-task-tracker case engine API contract
 * this consumer supports.
 *
 * Keep in sync with contracts/dependency-matrix.yaml in LL-task-tracker.
 * When the backend bumps its contract version, update this value and
 * update src/lib/contracts/index.ts to match the new shapes.
 */
export const SUPPORTED_CONTRACT_VERSION = "1.1.0"
