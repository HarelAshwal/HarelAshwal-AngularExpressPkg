import * as bodyParser from "body-parser";
import * as express from "express";
import * as path from "path";
import * as debug from 'debug';
import * as http from 'http';
import * as morgan from 'morgan';
import * as IndexRouter from "./IndexRouter";


// import * as indexRoute from "./routes/index";

/**
 * The server.
 *
 * @class Server
 */
export class WebServer {

    public app: express.Application;

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     */
    public static bootstrap(): WebServer {
        return new WebServer();
    }



    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        //create expressjs application
        this.app = express();

        //configure application
        this.config();

        //configure routes
        this.routes();
    }

    port = 3000;
    server: http.Server;

    start() {


        /**
         * Get port from environment and store in Express.
         */

        this.app.set('port', this.port.toString());

        /**
         * Create HTTP server.
         */

        this.server = http.createServer(this.app);

        /**
         * Listen on provided port, on all network interfaces.
         */

        this.server.listen(this.port);
        this.server.on('error', this.onError);
        this.server.on('listening', this.onListening);



    }

    /**
         * Event listener for HTTP server "error" event.
         */

    onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = typeof this.port === 'string'
            ? 'Pipe ' + this.port
            : 'Port ' + this.port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */

    onListening() {

        var addr = (this as any).address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        console.log('Web Server Listening on ' + bind);
    }

    /**
     * Configure application
     *
     * @class Server
     * @method config
     * @return void
     */
    private config() {
        this.app.set("views", path.join(__dirname, "views"));
        this.app.use(express.static(path.join(__dirname, '../dist')));

        //mount logger
        this.app.use(morgan("dev"));

        //mount json form parser
        this.app.use(bodyParser.json({ limit: '50mb' }));

        //mount query string parser
        this.app.use(bodyParser.urlencoded({ extended: true }));

        //add static paths
        this.app.use(express.static(path.join(__dirname, "public")));

        // catch 404 and forward to error handler
        this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            var error = new Error("Not Found");
            err.status = 404;
            next(err);
        });
    }

    /**
     * Configure routes
     *
     * @class Server
     * @method routes
     * @return void
     */
    private routes() {
        //get router
        let router: express.Router;
        router = express.Router();


        var indexApi = new IndexRouter.IndexRouter(router);

        //use router middleware
        this.app.use(router);

        this.app.get('*', function (req, res) {
            res.redirect('/');
        });
    }

}