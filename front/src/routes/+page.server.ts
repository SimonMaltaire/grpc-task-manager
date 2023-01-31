import type { PageServerLoad } from './$types';
import { ListTasksRequest } from '$lib/stubs/task/v1alpha/task';
import { toJson } from '$src/lib/helper/taskDto';

export const load: PageServerLoad = async ({ locals }) => {
	const listTaskRequest = ListTasksRequest.create();
	const request = await locals.client.listTasks(listTaskRequest);
	const listTasksResponse = request.response;

	const tasks = listTasksResponse.tasks.reverse().map(toJson);

	return {
		tasks
	};
};