import chalk from "chalk";

enum Level {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 4,
}

class Logger {
    private level: Level;

    constructor(initLevel: Level = Level.INFO) {
        this.level = initLevel;
    }

    setLevel(level: Level) {
        this.level = level;
    }

    private log(text: string, object?: object) {
        console.log(chalk.yellowBright(new Date().toLocaleString()), text);
        if (object) {
            console.log(object);
        }
    }

    error(label: string, text: string, object?: object) {
        if (this.level >= Level.ERROR) {
            this.log(
                `${chalk.bgRedBright.black.bold("[ERROR]")}` +
                    chalk.greenBright(` <${label}> `) +
                    `${text}`,
                object
            );
        }
    }

    warn(label: string, text: string, object?: object) {
        if (this.level >= Level.WARN) {
            this.log(
                `${chalk.bgYellowBright.black.bold("[WARN]")}` +
                    chalk.greenBright(` <${label}> `) +
                    `${text}`,
                object
            );
        }
    }

    info(label: string, text: string, object?: object) {
        if (this.level >= Level.INFO) {
            this.log(
                `${chalk.bgBlueBright.black.bold("[INFO]")}` +
                    chalk.greenBright(` <${label}> `) +
                    `${text}`,
                object
            );
        }
    }

    debug(label: string, text: string, object?: object) {
        if (this.level >= Level.DEBUG) {
            this.log(
                `${chalk.bgMagentaBright.black.bold("[DEBUG]")}` +
                    chalk.greenBright(` <${label}> `) +
                    `${text}`,
                object
            );
        }
    }
}

export const logger = new Logger(Level.DEBUG);
