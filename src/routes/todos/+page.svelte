<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Todo } from '$lib/server/database';
	import type { ActionData, PageData } from './$types';

    export let data: PageData;
    export let form: ActionData;

    let creating = false;
    let deleting: string[] = [];
    let todosFiltered: Todo[] = data.todos;
    let updating: Record<string, true> = {};

    $: {
        todosFiltered = data.todos.filter((todo) => !deleting.includes(todo.id));
    }
</script>

<h1>Todos</h1>

{#if form?.error}
    <p class="error">
        {form.error}
    </p>
{/if}

{#if form?.message}
    <p class="success">
        {form.message}
    </p>
{/if}

<form
    method="POST"
    action="?/create"
    use:enhance={() => {
        creating = true;

        return async ({ update }) => {
            await update();
            creating = false;
        }
    }}
>
    <label>
        { creating ? 'Saving...' : 'Add a todo:' }
        
        <input
            name="description"
            value={form?.description ?? ''}
            required
            disabled={creating}
        >
    </label>
</form>

<ul>
    {#each todosFiltered as todo (todo.id)}
        <li class="todo">
            <form
                method="POST"
                action="?/edit"
                style="display: inline-block;"
                use:enhance={() => {
                    updating = {
                        ...updating,
                        [todo.id]: true,
                    };

                    return async ({ update }) => {
                        await update();

                        updating = { ...updating };
                        delete updating[todo.id];
                    };
                }}
            >
                <input
                    type="hidden"
                    name="id"
                    value={todo.id}
                >

                {todo.description}
                
                <input
                    name="description"
                    value={todo.description}
                    disabled={updating[todo.id]}
                    data-description={todo.description}
                />

                <button
                    aria-label="Save todo"
                    disabled={updating[todo.id]}
                >
                    💾
                </button>
            </form>

            <form
                method="POST"
                action="?/delete"
                style="display: inline-block;"
                use:enhance={() => {
                    deleting = [...deleting, todo.id];

                    return async ({ update }) => {
                        await update();
                        deleting = deleting.filter((id) => id !== todo.id);
                    };
                }}
            >
                <input
                    type="hidden"
                    name="id"
                    value={todo.id}
                >

                <button
                    aria-label="Mark as complete"
                >
                    ❌
                </button>
            </form>
        </li>
    {/each}
</ul>