"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnswerType = exports.ModuleType = exports.StudentAccessType = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["TEACHER"] = "TEACHER";
    UserRole["STUDENT"] = "STUDENT";
})(UserRole || (exports.UserRole = UserRole = {}));
var StudentAccessType;
(function (StudentAccessType) {
    StudentAccessType["INTERNAL"] = "INTERNAL";
    StudentAccessType["EXTERNAL"] = "EXTERNAL";
})(StudentAccessType || (exports.StudentAccessType = StudentAccessType = {}));
var ModuleType;
(function (ModuleType) {
    ModuleType["CHAPTER"] = "CHAPTER";
    ModuleType["EXAM"] = "EXAM";
    ModuleType["ASSIGNMENT"] = "ASSIGNMENT";
    ModuleType["ATTACHMENT"] = "ATTACHMENT";
})(ModuleType || (exports.ModuleType = ModuleType = {}));
var AnswerType;
(function (AnswerType) {
    AnswerType["MCQ"] = "MCQ";
    AnswerType["TRUE_FALSE"] = "TRUE_FALSE";
    AnswerType["SHORT_ANSWER"] = "SHORT_ANSWER";
})(AnswerType || (exports.AnswerType = AnswerType = {}));
