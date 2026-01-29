export interface EventBus {
  publish(subject: string, payload: unknown): Promise<void>;
}
