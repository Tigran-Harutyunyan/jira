import { createSessionClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import { type Task } from "@/features/tasks/types";

const { DATABASE_ID, MEMBERS_ID, TASKS_ID } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const {
        name,
        status,
        projectId,
        dueDate,
        assigneeId,
        description
    } = await readBody(event);

    const params = event.context.params;
    const taskId = params && 'taskId' in params ? params.taskId : '';

    try {
        const { account, databases } = await createSessionClient(event);

        const existingTask = await databases.getDocument<Task>(
            DATABASE_ID,
            TASKS_ID,
            taskId,
        );

        const user = await account.get();

        const members = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [
                Query.equal("workspaceId", existingTask.workspaceId),
                Query.equal("userId", user.$id)
            ]
        );

        if (!members.documents[0]) {
            return createError({
                statusCode: 401,
                statusMessage: 'Unauthorized'
            });
        }

        const task = await databases.updateDocument<Task>(
            DATABASE_ID,
            TASKS_ID,
            taskId,
            {
                name,
                status,
                projectId,
                dueDate,
                assigneeId,
                description,
            },
        );

        return { ...task };

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }
}); 