"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteRequest = exports.putRequest = exports.postRequest = exports.getRequest = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var url = 'http://localhost:8080';

var getRequest = function getRequest(path) {
  var params,
      token,
      config,
      response,
      _args = arguments;
  return regeneratorRuntime.async(function getRequest$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          params = _args.length > 1 && _args[1] !== undefined ? _args[1] : '';
          token = localStorage.getItem('token');
          config = {
            headers: {
              Authorization: "Bearer ".concat(token)
            }
          };
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(_axios["default"].get("".concat(url).concat(path).concat(params), config));

        case 6:
          response = _context.sent;
          return _context.abrupt("return", response);

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](3);
          console.log(_context.t0);
          return _context.abrupt("return", _context.t0);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 10]]);
};

exports.getRequest = getRequest;

var postRequest = function postRequest(path, body) {
  var token, config, response;
  return regeneratorRuntime.async(function postRequest$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          token = localStorage.getItem('token');
          config = {
            headers: {
              Authorization: "Bearer ".concat(token)
            }
          };
          _context2.prev = 2;
          _context2.next = 5;
          return regeneratorRuntime.awrap(_axios["default"].post("".concat(url).concat(path), body, config));

        case 5:
          response = _context2.sent;
          return _context2.abrupt("return", response);

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](2);
          console.log(_context2.t0);
          return _context2.abrupt("return", _context2.t0);

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[2, 9]]);
};

exports.postRequest = postRequest;

var putRequest = function putRequest(path, body) {
  var params,
      token,
      config,
      response,
      _args3 = arguments;
  return regeneratorRuntime.async(function putRequest$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          params = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : '';
          token = localStorage.getItem('token');
          config = {
            headers: {
              Authorization: "Bearer ".concat(token)
            }
          };
          _context3.prev = 3;
          _context3.next = 6;
          return regeneratorRuntime.awrap(_axios["default"].put("".concat(url).concat(path).concat(params), body, config));

        case 6:
          response = _context3.sent;
          return _context3.abrupt("return", response);

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](3);
          console.log(_context3.t0);
          return _context3.abrupt("return", _context3.t0);

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[3, 10]]);
};

exports.putRequest = putRequest;

var deleteRequest = function deleteRequest(path, params) {
  var token, config, response;
  return regeneratorRuntime.async(function deleteRequest$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          token = localStorage.getItem('token');
          config = {
            headers: {
              Authorization: "Bearer ".concat(token)
            }
          };
          _context4.prev = 2;
          _context4.next = 5;
          return regeneratorRuntime.awrap(_axios["default"]["delete"]("".concat(url).concat(path).concat(params), config));

        case 5:
          response = _context4.sent;
          return _context4.abrupt("return", response);

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](2);
          console.log(_context4.t0);
          return _context4.abrupt("return", _context4.t0);

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[2, 9]]);
};

exports.deleteRequest = deleteRequest;