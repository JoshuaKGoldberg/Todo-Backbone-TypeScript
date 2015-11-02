/// <reference path="../lib/backbone.d.ts" />
/// <reference path="../lib/backbone-localstorage.d.ts" />

module Demo.Todo.BackboneApp {
    /**
     * A simple representation of a todo's state.
     */
    export interface ITodoValue {
        /**
         * When this todo was originally created (used as a GUID).
         */
        timestamp: number;

        /**
         * The displayed text of the todo (also its identifier).
         */
        text: string;

        /**
         * Whether the todo has been completed already.
         */
        completed: boolean;
    }

    /**
     * A simple Backbone model that should contain the schema in ITodoValue.
     */
    export class Todo extends Backbone.Model {
        /**
         * Toggles whether the completed attribute is true or false.
         */
        toggle(): void {
            this.set("completed", !this.get("completed"));
        }
    }

    /**
     * A simple Backbone collection of Todo models stored in localStorage.
     */
    export class TodoList extends Backbone.Collection<Todo> {
        model: typeof Todo;
        localStorage: Backbone.LocalStorage;

        constructor(stateName: string, models?: Todo[] | Object[], options?: any) {
            this.model = Todo;
            this.localStorage = new Backbone.LocalStorage("todo-backbone-" + stateName);

            super(models, options);
        }
    }
}
