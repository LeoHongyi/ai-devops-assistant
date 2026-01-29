import { healthCheck } from "../../../application/usecases/health-check";

export function healthController() {
  return healthCheck();
}
