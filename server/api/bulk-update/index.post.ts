import { createSessionClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import { type Task } from '@/features/tasks/types';

const { DATABASE_ID, TASKS_ID, MEMBERS_ID } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const { tasks } = await readBody(event);
    const payload = JSON.parse(tasks);

    try {
        const { account, databases, } = await createSessionClient(event);

        const tasksToUpdate = await databases.listDocuments<Task>(
            DATABASE_ID,
            TASKS_ID,
            [Query.contains("$id", payload.map((task: Task) => task.$id))]
        );

        const workspaceIds = new Set(tasksToUpdate.documents.map(task => task.workspaceId));

        if (workspaceIds.size !== 1) {
            return createError({
                statusCode: 400,
                statusMessage: 'All tasks must belong to the same workspace'
            })
        }

        const workspaceId = workspaceIds.values().next().value;

        if (!workspaceId) {
            return createError({
                statusCode: 400,
                statusMessage: 'Workspace ID is required'
            })

        }

        const user = await account.get();

        const members = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [
                Query.equal("workspaceId", workspaceId),
                Query.equal("userId", user.$id)
            ]
        );

        if (!members.documents[0]) {
            return createError({
                statusCode: 401,
                statusMessage: 'Unauthorized'
            });
        }

        const updatedTasks = await Promise.all(
            payload.map(async (task: Task) => {
                const { $id, status, position } = task;
                return databases.updateDocument<Task>(
                    DATABASE_ID,
                    TASKS_ID,
                    $id,
                    { status, position }
                );
            })
        );

        return { ...updatedTasks };


    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }
}); 