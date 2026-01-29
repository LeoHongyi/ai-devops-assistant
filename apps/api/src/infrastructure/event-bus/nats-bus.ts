import { connect, NatsConnection, StringCodec } from "nats";
import { EventBus } from "../../application/ports/event-bus";

const sc = StringCodec();

export class NatsBus implements EventBus {
  private constructor(private nc: NatsConnection) {}

  static async connect(url: string) {
    const nc = await connect({ servers: url });
    return new NatsBus(nc);
  }

  async publish(subject: string, payload: unknown): Promise<void> {
    this.nc.publish(subject, sc.encode(JSON.stringify(payload)));
  }
}
