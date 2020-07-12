import { LitElement, html } from '@polymer/lit-element';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-checkbox';
import '@vaadin/vaadin-radio-button/vaadin-radio-button';
import '@vaadin/vaadin-radio-button/vaadin-radio-group';
import { connect } from 'pwa-helpers';
import { visibilityFilters, getVisibleTodosSelector } from '../redux/reducer';
import { store } from '../redux/store';
import { addTodo, updateTodoStatus, updateFilter, clearCompleted } from '../redux/actions';
class TodoView extends connect(store)(LitElement) {

    static get properties() {
        return {
            todos: { type: Array},
            filter: { type: String},
            task: { type: String}
        }
    };

    stateChanged(state) {
        this.todos = getVisibleTodosSelector(state);
        this.filter = state.filter;
    }

    updateTask(e) {
        this.task = e.target.value;
    };

    addTodo() {
        if(this.task) {
            store.dispatch(addTodo(this.task));
            this.task = '';
        }
    };

    shortcutListener(e) {
        if (e.key === "Enter") {
            this.addTodo();
        }
    };

    updateTodoStatus(updatedTodo, complete) {
        store.dispatch(updateTodoStatus(updatedTodo, complete));
    };

    filterChanged(e) {
        store.dispatch(updateFilter(e.detail.value));
    };

    clearCompleted() {
        store.dispatch(clearCompleted());
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
                    value="${this.task || ''}"
                    @change="${this.updateTask}"
                ></vaadin-text-field>
                <vaadin-button
                    theme="primary"
                    @click="${this.addTodo}"
                >Add todo</vaadin-button>
            </div>

            <div class="todos-list">
                ${
                    this.todos.map(todo => html`
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