type ConsoleMethod = "log" | "warn" | "error";

export class Logger {
    static enabled = false;
    static console = console;

    static log(message: string, method: ConsoleMethod = "log") {
        if (Logger.enabled) {
            Logger.console[method](message);
        }
    }
}
