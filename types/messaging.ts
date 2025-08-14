/**
 * Inter-script communication and messaging types
 */

export interface IDBMessage {
  source: string;
  action: string;
  payload: Record<string, unknown>;
}