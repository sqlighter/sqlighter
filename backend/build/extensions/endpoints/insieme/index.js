"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var extensions_sdk_1 = require("@directus/extensions-sdk");
var pino_1 = require("./pino");
exports.default = (0, extensions_sdk_1.defineEndpoint)(function (router, _a) {
    var services = _a.services, exceptions = _a.exceptions;
    var ItemsService = services.ItemsService;
    var ServiceUnavailableException = exceptions.ServiceUnavailableException;
    router.get('/', function (req, res, next) {
        var recipeService = new ItemsService('posts', { schema: req.schema, accountability: req.accountability });
        recipeService
            .readByQuery({ fields: ['*.*'] })
            .then(function (results) {
            return res.json(results);
        })
            .catch(function (error) {
            return next(new ServiceUnavailableException(error.message));
        });
    });
    router.get('/', function (_req, res) { return res.send('Hello, World!'); });
    router.get('/version', function (req, res) {
        var version = (0, pino_1.addOne)(8);
        res.json({ version: "v".concat(version), method: req.method });
    });
});
//# sourceMappingURL=index.js.map