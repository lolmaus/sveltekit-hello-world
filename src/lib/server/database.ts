export const db: Map<string, Todo[]> = new Map();

export type Todo = {
	id: string;
	description: string;
	done: boolean;
};

export function getTodos(userId: string): Todo[] {
	return db.get(userId) ?? [];
}

export function createTodo(userId: string, description: string) {
	if (!db.has(userId)) {
		db.set(userId, []);
	}

	const todos = db.get(userId);

	if (!todos) {
		throw new Error(`Missing todos for userid ${userId}, this should not happen`);
	}

	if (!description.length) {
		throw new Error('description cannot be empty');
	}

	// if (todos.find((todo) => todo.description === description)) {
	// 	throw new Error('Such todo already exists');
	// }

	todos.push({
		id: crypto.randomUUID(),
		description,
		done: false
	});
}

export function deleteTodo(userId: string, todoId: string) {
	const todos = db.get(userId);

	if (!todos) {
		throw new Error(`Todos not found for user ${userId}`);
	}

	const index = todos.findIndex((todo) => todo.id === todoId);

	if (index < 0) {
		throw new Error(`Todo with id ${todoId} does not exist for user ${userId}.`);
	}

	const todo = todos[index];
	todos.splice(index, 1);
	return todo;
}

export function editTodo(userId: string, todoId: string, description: string) {
	const todos = db.get(userId);

	if (!todos) {
		throw new Error(`Todos not found for user ${userId}`);
	}

	const todo = todos.find((todo) => todo.id === todoId);

	if (!todo) {
		throw new Error(`Todo with id ${todoId} does not exist for user ${userId}.`);
	}

	todo.description = description;
	return todo;
}
