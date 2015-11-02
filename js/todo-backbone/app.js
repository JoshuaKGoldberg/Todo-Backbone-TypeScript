/// <reference path="../lib/backbone.d.ts" />
/// <reference path="models.ts" />
/// <reference path="views.ts" />
var Demo;
(function (Demo) {
    var Todo;
    (function (Todo) {
        var BackboneApp;
        (function (BackboneApp) {
            new BackboneApp.AppView();
        })(BackboneApp = Todo.BackboneApp || (Todo.BackboneApp = {}));
    })(Todo = Demo.Todo || (Demo.Todo = {}));
})(Demo || (Demo = {}));
