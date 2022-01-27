"use strict";
//
// index.ts
//
Object.defineProperty(exports, "__esModule", { value: true });
var extensions_sdk_1 = require("@directus/extensions-sdk");
var packageJson = require('./package.json');
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
    /** Package that was built */
    router.get('/version', function (req, res) {
        var name = packageJson.name, author = packageJson.author, version = packageJson.version;
        res.json({ name: name, author: author, version: version });
    });
});
//# sourceMappingURL=index.js.map