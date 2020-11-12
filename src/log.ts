import { Logger } from "tslog";

export const log: Logger = new Logger({ name: "main" });
export const apiLog: Logger = new Logger({ name: "API" });
