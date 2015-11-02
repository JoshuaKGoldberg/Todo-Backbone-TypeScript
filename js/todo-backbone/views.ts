/// <reference path="../lib/backbone.d.ts" />

module Demo.Todo.BackboneApp {
    /**
     * A driving controller for a todo application. This is technically more of
     * an MVVM ViewModel than a View, as it contains ViewModel/Controller-y logic.
     */
    export class AppView extends Backbone.View<any> {
        /**
         * Listing of added todos.
         */
        private todos: TodoList;

        /**
         * The text input for new todos' text.
         */
        private inputText: JQuery;

        /**
         * The button to add a new todo.
         */
        private inputAdd: JQuery;

        /**
         * The button to clear all todos.
         */
        private inputClear: JQuery;

        /**
         * Container containing incomplete todos' elements.
         */
        private containerIncomplete: JQuery;

        /**
         * Container containing completed todos' elements.
         */
        private containerCompleted: JQuery;

        /**
         * Initializes a new instanceof of the AppView class. Lists of todos 
         * are created for incomplete and complete items.
         */
        constructor() {
            this.el = "#todoapp";

            super();

            this.inputText = this.$("#input-text");
            this.inputAdd = this.$("#input-button");
            this.inputClear = this.$("#input-clear");
            this.containerIncomplete = this.$("#todos-incomplete");
            this.containerCompleted = this.$("#todos-completed");

            this.inputClear.click(this.clearTodos.bind(this));

            this.todos = new TodoList("my-todos");
            this.todos.on("add", this.onAddTodo, this);
            this.todos.on("change:completed", this.onChangeTodo, this);
            this.todos.fetch();
        }

        /**
         * @returns Events listing for the AppView, namely the key press
         *          binder for input element.
         */
        events(): any {
            return {
                "keypress #input-text": "onInputKeyPress",
                "click #input-button": "addTodo"
            };
        }

        /**
         * Adds a new todo to the the collection.
         */
        addTodo(): void {
            this.todos.create(this.createTodoValue());
        }

        /**
         * Removes all todos from the 
         */
        clearTodos(): void {
            this.todos.forEach((todo: Todo): void => {
                Backbone.sync("delete", todo);
                this.findTodoElement(todo).remove();
            });
        }

        /**
         * When the enter key is pressed on the input, add a new input
         * to the collection.
         * 
         * @param event   The source keyboard event.
         */
        private onInputKeyPress(event: KeyboardEvent): void {
            if (event.which !== 13) {
                return;
            }

            this.addTodo();
        }

        /**
         * @returns Default properties for a new todo item, with text
         *          from the text input.
         */
        private createTodoValue(): ITodoValue {
            return {
                timestamp: new Date().getTime(),
                text: this.inputText.val(),
                completed: false
            };
        }

        /**
         * Reacts to an addition to the todos by adding the todo to the
         * container appropriate for its completed status.
         * 
         * @param todo   The model to be added.
         */
        private onAddTodo(todo: Todo): void {
            var element: JQuery = (new TodoView(todo)).render().$el;

            if (todo.get("completed")) {
                element.appendTo(this.containerCompleted);
            } else {
                element.appendTo(this.containerIncomplete);
            }
        }

        /**
         * Moves a todo from incomplete to complete or vice versa.
         * 
         * @param todo   The model to be moved.
         */
        private onChangeTodo(todo: Todo): void {
            if (todo.get("completed")) {
                this.findTodoElement(todo).appendTo(this.containerCompleted);
            } else {
                this.findTodoElement(todo).appendTo(this.containerIncomplete);
            }

            this.todos.sync("update", todo);
        }

        /**
         * @param todo   A todo whose element is to be found.
         * @return The todo's element.
         */
        private findTodoElement(todo: Todo): JQuery {
            return this.$el.find("#" + todo.get("timestamp"));
        }
    }

    /**
     * A small view class for displaying a single todo in an HTML.
     */
    export class TodoView extends Backbone.View<Todo> {
        /**
         * The Underscore template used to generate the HTML view.
         */
        private template: (...data: any[]) => string;

        /**
         * Initializes a new instance of the TodoView class.
         * 
         * @param model   The model this displays a view around.
         */
        constructor(todo: Todo) {
            this.model = todo;
            this.tagName = "div";
            this.template = _.template($("#todo-template").html());

            super();
        }

        /**
         * Renders the view using the todo-template, and binds the input
         * inside to toggling the model's completed status.
         * 
         * @returns this
         */
        render(): TodoView {
            this.$el.html(this.template(this.model.toJSON()));

            this.$el.find("input").change(this.onToggle.bind(this));

            return this;
        }

        /**
         * Reacts to an input being toggled by calling the model's toggle.
         */
        private onToggle(): void {
            this.model.toggle();
        }
    }
}
