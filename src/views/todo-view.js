import { LitElement, html } from '@polymer/lit-element';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-checkbox';
import '@vaadin/vaadin-radio-button/vaadin-radio-button';
import '@vaadin/vaadin-radio-button/vaadin-radio-group';

const visibilityFilters = {
    SHOW_ALL: 'All',
    SHOW_ACTIVE: 'Active',
    SHOW_COMPLETED: 'Completed',
};

class TodoView extends LitElement {

    static get properties() {
        return {
            todos: { type: Array},
            filter: { type: String},
            task: { type: String}
        }
    };

    constructor() {
        super();
        this.todos = [];
        this.filter = visibilityFilters.SHOW_ALL;
        this.task = '';
    };

    updateTask(e) {
        this.task = e.target.value;
    };

    addTodo() {
        if(this.task) {
            this.todos = [ ...this.todos, {
                task: this.task,
                complete: false
            }];
            this.task = '';
        }
    };

    shortcutListener(e) {
        if (e.key === "Enter") {
            this.addTodo();
        }
    };

    updateTodoStatus(updatedTodo, complete) {
        this.todos = this.todos.map(todo => 
            updatedTodo === todo ? { ...updatedTodo, complete } : todo
        );
    };

    filterChanged(e) {
        this.filter = e.target.value
    };

    applyFilter(todos) {
        switch (this.filter) {
            case visibilityFilters.SHOW_ACTIVE:
                return todos.filter(todo => !todo.complete);
            case visibilityFilters.SHOW_COMPLETED:
                return todos.filter(todo => todo.complete);
            default:
                return todos;
        }
    };

    clearCompleted() {
        this.todos = this.todos.filter(todo => !todo.complete);
    };

    createRenderRoot() {
        return this
    }

    render() {
        return html`
            <style>
                todo-view {
                    display: block;
                    max-width: 800px;
                    margin: 0 auto;
                }
                todo-view .input-layout {
                    width: 100%;
                    display: flex;
                }
                todo-view .input-layout vaadin-text-field {
                    flex: 1;
                    margin-right: var(--spacing);
                }
                todo-view .todos-list {
                    margin-top: var(--spacing);
                }
                todo-view .visibility-filter {
                    margin-top: calc(4 * var(--spacing));
                }
            </style>
            <div class="input-layout" @keyup="${this.shortcutListener}">
                <vaadin-text-field
                    placeholder="Task"
                    value="${this.task}"
                    @change="${this.updateTask}"
                ></vaadin-text-field>
                <vaadin-button
                    theme="primary"
                    @click="${this.addTodo}"
                >Add todo</vaadin-button>
            </div>

            <div class="todos-list">
                ${
                    this.applyFilter(this.todos).map(todo => html`
                    <div class="todo-item">
                        <vaadin-checkbox
                            ?checked="${todo.complete}"
                            @change="${e => this.updateTodoStatus(todo, e.target.checked)}"
                        >${todo.task}</vaadin-checkbox>
                    </div>
                `)}
            </div>

            <vaadin-radio-group
                class="visibility-filter"
                value="${this.filter}"
                @value-changed="${this.filterChanged}"
            >
                ${Object.values(visibilityFilters).map(filter => html`
                    <vaadin-radio-button value="${filter}">${filter}</vaadin-radio-button>
                `)}
            </vaadin-radio-group>
            <vaadin-button @click="${this.clearCompleted}">
                Clear Completd
            </vaadin-button>
        `;
    };
};

customElements.define('todo-view', TodoView);