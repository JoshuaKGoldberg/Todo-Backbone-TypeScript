/// <reference path="../lib/backbone.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Demo;
(function (Demo) {
    var Todo;
    (function (Todo) {
        var BackboneApp;
        (function (BackboneApp) {
            /**
             * A driving controller for a todo application. This is technically more of
             * an MVVM ViewModel than a View, as it contains ViewModel/Controller-y logic.
             */
            var AppView = (function (_super) {
                __extends(AppView, _super);
                /**
                 * Initializes a new instanceof of the AppView class. Lists of todos
                 * are created for incomplete and complete items.
                 */
                function AppView() {
                    this.el = "#todoapp";
                    _super.call(this);
                    this.inputText = this.$("#input-text");
                    this.inputAdd = this.$("#input-button");
                    this.inputClear = this.$("#input-clear");
                    this.containerIncomplete = this.$("#todos-incomplete");
                    this.containerCompleted = this.$("#todos-completed");
                    this.inputClear.click(this.clearTodos.bind(this));
                    this.todos = new BackboneApp.TodoList("my-todos");
                    this.todos.on("add", this.onAddTodo, this);
                    this.todos.on("change:completed", this.onChangeTodo, this);
                    this.todos.fetch();
                }
                /**
                 * @returns Events listing for the AppView, namely the key press
                 *          binder for input element.
                 */
                AppView.prototype.events = function () {
                    return {
                        "keypress #input-text": "onInputKeyPress",
                        "click #input-button": "addTodo"
                    };
                };
                /**
                 * Adds a new todo to the the collection.
                 */
                AppView.prototype.addTodo = function () {
                    this.todos.create(this.createTodoValue());
                };
                /**
                 * Removes all todos from the
                 */
                AppView.prototype.clearTodos = function () {
                    var _this = this;
                    this.todos.forEach(function (todo) {
                        Backbone.sync("delete", todo);
                        _this.findTodoElement(todo).remove();
                    });
                };
                /**
                 * When the enter key is pressed on the input, add a new input
                 * to the collection.
                 *
                 * @param event   The source keyboard event.
                 */
                AppView.prototype.onInputKeyPress = function (event) {
                    if (event.which !== 13 || !this.inputText.val().trim()) {
                        return;
                    }
                    this.addTodo();
                };
                /**
                 * @returns Default properties for a new todo item, with text
                 *          from the text input.
                 */
                AppView.prototype.createTodoValue = function () {
                    return {
                        timestamp: new Date().getTime(),
                        text: this.inputText.val(),
                        completed: false
                    };
                };
                /**
                 * Reacts to an addition to the todos by adding the todo to the
                 * container appropriate for its completed status.
                 *
                 * @param todo   The model to be added.
                 */
                AppView.prototype.onAddTodo = function (todo) {
                    var element = (new TodoView(todo)).render().$el;
                    if (todo.get("completed")) {
                        element.appendTo(this.containerCompleted);
                    }
                    else {
                        element.appendTo(this.containerIncomplete);
                    }
                };
                /**
                 * Moves a todo from incomplete to complete or vice versa.
                 *
                 * @param todo   The model to be moved.
                 */
                AppView.prototype.onChangeTodo = function (todo) {
                    if (todo.get("completed")) {
                        this.findTodoElement(todo).appendTo(this.containerCompleted);
                    }
                    else {
                        this.findTodoElement(todo).appendTo(this.containerIncomplete);
                    }
                    this.todos.sync("update", todo);
                };
                /**
                 * @param todo   A todo whose element is to be found.
                 * @return The todo's element.
                 */
                AppView.prototype.findTodoElement = function (todo) {
                    return this.$el.find("#" + todo.get("timestamp"));
                };
                return AppView;
            })(Backbone.View);
            BackboneApp.AppView = AppView;
            /**
             * A small view class for displaying a single todo in an HTML.
             */
            var TodoView = (function (_super) {
                __extends(TodoView, _super);
                /**
                 * Initializes a new instance of the TodoView class.
                 *
                 * @param model   The model this displays a view around.
                 */
                function TodoView(todo) {
                    this.model = todo;
                    this.tagName = "div";
                    this.template = _.template($("#todo-template").html());
                    _super.call(this);
                }
                /**
                 * Renders the view using the todo-template, and binds the input
                 * inside to toggling the model's completed status.
                 *
                 * @returns this
                 */
                TodoView.prototype.render = function () {
                    this.$el.html(this.template(this.model.toJSON()));
                    this.$el.find("input").change(this.onToggle.bind(this));
                    return this;
                };
                /**
                 * Reacts to an input being toggled by calling the model's toggle.
                 */
                TodoView.prototype.onToggle = function () {
                    this.model.toggle();
                };
                return TodoView;
            })(Backbone.View);
            BackboneApp.TodoView = TodoView;
        })(BackboneApp = Todo.BackboneApp || (Todo.BackboneApp = {}));
    })(Todo = Demo.Todo || (Demo.Todo = {}));
})(Demo || (Demo = {}));
