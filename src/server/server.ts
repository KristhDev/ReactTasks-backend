import express, { Application } from 'express';
import useragent from 'express-useragent';
import fileUpload from 'express-fileupload';
import cors from 'cors';

/* Database */
import { Database } from '@database';

/* Server */
import { Logger, loggerRequest, loggerResponse, Http } from '@server';

/* Modules */
import { EmailService, authRouter } from '@auth';
import { ImageService } from '@images';
import { taskRouter } from '@tasks';

class Server {
    /** 
     * `private app: Application = express();` is creating an instance of the Express application and
     * assigning it to the `app` property of the `Server` class. The `Application` type is imported
     * from the `express` module and it represents the Express application. By assigning `express()` to
     * `app`, the `Server` class is creating an instance of the Express application that can be used to
     * set up middleware, routes, and listen on a port. 
     */
    private app: Application = express();

    /** 
     * `private port: number = parseInt(process.env.PORT || '9000');` is initializing the `port`
     * property of the `Server` class with the value of the `PORT` environment variable, parsed as an
     * integer using `parseInt()`. If the `PORT` environment variable is not set, it defaults to
     * `9000`. This allows the server to listen on the port specified by the `PORT` environment
     * variable, or on port `9000` if the variable is not set. 
     */
    private port: number = parseInt(process.env.PORT || '9000');

    /**
     * Adds middleware functions to the Express app instance.
     *
     * @return {void} Nothing is returned
     */
    private middlewares(): void {
        this.app.use(useragent.express());
        this.app.use(cors());
        this.app.use(fileUpload({
            limits: { fileSize: 50 * 1024 * 1024 },
            useTempFiles : true,
            tempFileDir : '/tmp/'
        }));
        this.app.use(express.json());
        this.app.use(loggerRequest);
        this.app.use(loggerResponse);
    }

    /**
     * Assigns all the necessary routes for the application by mapping the route paths to their 
     * respective route handlers.
     *
     * @return {void} This function does not return anything.
     */
    private routes(): void {
        this.app.use('/api/auth', authRouter);
        this.app.use('/api/tasks', taskRouter);
        this.app.use('/*', (_, res) => Http.notFound(res));
    }

    /**
     * Initializes a new Database instance and establishes a connection to it asynchronously.
     *
     * @return {Promise<void>} A Promise that resolves when the connection is established successfully,
     * or rejects if an error occurs.
     */
    private async database(): Promise<void> {
        const db = new Database();
        await db.connect();
    }

    /**
     * Initializes the necessary services.
     *
     * This function initializes the email service and the image service.
     * It calls the static initialize method of each service class.
     * @return {void} Nothing is returned
     */
    private services(): void {
        EmailService.initialize();
        ImageService.initialize();
    }

    /**
     * Initializes the server by setting up the database, middlewares, and routes.
     * Then the server listens on the specified port.
     *
     * @return {void} None
     */
    public listen(): void {
        this.database();
        this.middlewares();
        this.routes();
        this.services();

        this.app.listen(this.port, () => {
            Logger.info(`Server listening on port ${ process.env.PORT || 9000 }`);
        });
    }

    /**
     * Get the application instance.
     *
     * @return {Application} the application instance
     */
    public getApp(): Application {
        this.database();
        this.middlewares();
        this.routes();
        this.services();

        return this.app;
    }
}

export default Server;