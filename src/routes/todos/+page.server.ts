import * as db from "../../lib/server/database";
import { fail, type Cookies } from '@sveltejs/kit';

export function load({ cookies }: { cookies: Cookies}) {
    const id = cookies.get('userid');

    if (!id) {
        cookies.set('userid', crypto.randomUUID(), {path: '/'});
    }

    return {
        todos: id ? db.getTodos(id) : [],
    }
}

export const actions = {
    create: async ({ cookies, request }: { cookies: Cookies, request: Request}) => {
        await new Promise((r) => setTimeout(r, 1000));

        const formData = await request.formData();
        const description = formData.get('description');
        const userId = cookies.get('userid');

        if (!userId) {
            throw new Error('userId expected from cookie');
        }

        if (typeof description !== 'string') {
            throw new Error('description expected to be a stirng');
        }

        try {
            db.createTodo(userId, description);
        } catch (e) {
            return fail(
                422,
                {
                    description,
                    error: (e as Error)?.message,
                }
            );
        }

        return {
            message: `Todo created successfully: ${description}`,
        };
    },

    delete: async ({ cookies, request } : {cookies: Cookies, request: Request}) => {
        await new Promise((r) => setTimeout(r, 1000));

        const formData = await request.formData();
        const todoId = formData.get('id');
        const userId = cookies.get('userid');

        if (!userId) {
            throw new Error('userId expected from cookie');
        }

        if (typeof todoId !== 'string') {
            throw new Error('id expected to be a stirng');
        }

        const deletedTodo = db.deleteTodo(userId, todoId);

        return {
            message: `Todo deleted: ${deletedTodo.description}`,
        };
    },

    edit: async ({ cookies, request } : {cookies: Cookies, request: Request}) => {
        await new Promise((r) => setTimeout(r, 1000));
        
        const formData = await request.formData();
        const todoId = formData.get('id');
        const description = formData.get('description');
        const userId = cookies.get('userid');

        if (!userId) {
            throw new Error('userId expected from cookie');
        }

        if (typeof todoId !== 'string') {
            throw new Error('todo id expected to be a stirng');
        }

        if (typeof description !== 'string') {
            throw new Error('description expected to be a stirng');
        }

        const editedTodo = db.editTodo(userId, todoId, description);

        return {
            message: `Todo edited: ${editedTodo.description}`,
        };
    },
}