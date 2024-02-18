import { addColors, createLogger, format, transports, Logform } from 'winston';
import timestampColorize from 'winston-timestamp-colorize';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';

/**
 * An object that contains color codes for different log levels.
 */
const colorLevels = {
    error: 'red',
    warn: 'yellow',
    info: 'cyan',
    success: 'green',
    http: 'magenta',
    verbose: 'cyan',
    debug: 'white',
    silly: 'grey'
}

/**
 * An object that defines custom log levels with their respective levels and colors.
 */
const customLevels = {
    colors: colorLevels,
    levels: {
        error: 0,
        warn: 1,
        success: 2,
        info: 3,
        http: 4,
        verbose: 5,
        debug: 6,
        silly: 7
    }
}

addColors(customLevels.colors);

class Logger {
    /**
     * Formats the given date into a string with the format 'dd-mm-yyyy'.
     *
     * @param {Date} date - The date to be formatted.
     * @return {string} The formatted date string.
     */
    private static loggerFormatDate (date: Date): string {
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
        .replace(/\//g, '-');
    }

    /**
     * A Winston format that converts log levels to uppercase.
     *
     * @param {object} info - The log entry.
     * @return {Logform.Format} The log entry with the level converted to uppercase.
     */
    private static levelFormat(): Logform.Format {
        return format(info => {
            info.level = info.level.toUpperCase();
            return info;
        })();
    }

    /**
     * A Winston format that formats the log message.
     *
     * @param {object} info - The log entry.
     * @return {Logform.Format} The formatted log message.
     */
    private static messageFormat(): Logform.Format { 
        return format.printf(
            (info) => `[${ info.level }] ${ info.timestamp } ${ info.message }`
        );
    }

    /**
     * Creates a format for winston logger that includes level, timestamp, colorization, and message.
     *
     * @return {Logform.Format} The winston format object.
     */
    private static consoleLoggerFormat (): Logform.Format {
        return format.combine(
            Logger.levelFormat(),
            format.timestamp({ format: 'HH:mm:ss' }),
            timestampColorize({ color: 'gray' }),
            format.colorize(), 
            Logger.messageFormat()
        );
    }

    /**
     * Returns a Winston format that combines the level, timestamp, and message
     * formats for file logging.
     *
     * @return {Logform.Format} The combined Winston format.
     */
    private static fileLoggerFormat (): Logform.Format {
        return format.combine(
            Logger.levelFormat(),
            format.timestamp({ format: 'HH:mm:ss' }),
            Logger.messageFormat()
        );
    }

    /**
     * An instance of Logtail to send logs to Logtail server.
     */
    private static logtail = new Logtail(process.env.LOGTAIL_TOKEN!);

    /**
     * A winston logger object that logs messages to the console and a log file.
     */
    private static log = createLogger({
        levels: customLevels.levels,
        transports: [
            new transports.Console({
                format: Logger.consoleLoggerFormat()
            }),
            new LogtailTransport(Logger.logtail, {
                format: Logger.fileLoggerFormat()
            }),
        ],
    });

    /**
     * Logs an informational message.
     *
     * @param {string} message - The message to be logged.
     * @return {void} This function does not return a value.
     */
    public static info(message: string): void {
        Logger.log.info(message);
        Logger.logtail.flush();
    }

    /**
     * Logs a success message.
     *
     * @param {string} message - The success message to log.
     * @return {void} This function does not return a value.
     */
    public static success(message: string): void {
        Logger.log.log('success', message);
        Logger.logtail.flush();
    }

    /**
     * Logs an error message.
     *
     * @param {string} message - The error message to be logged.
     * @return {void} 
     */
    public static error(message: string): void {
        Logger.log.error(message);
        Logger.logtail.flush();
    }
}

export default Logger;