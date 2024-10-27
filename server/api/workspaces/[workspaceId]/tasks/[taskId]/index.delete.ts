import { createSessionClient, createAdminClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import { type Task } from "@/features/tasks/types";

const { DATABASE_ID, MEMBERS_ID, TASKS_ID } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    try {
        const { account, databases } = await createSessionClient(event);

        let user = await account.get();
        const params = event.context.params;
        const taskId = params && 'taskId' in params ? params.taskId : '';

        const task = await databases.getDocument<Task>(
            DATABASE_ID,
            TASKS_ID,
            taskId,
        );

        let members = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [Query.equal("userId", user.$id)]
        );

        if (!members.documents[0]) {
            return createError({
                statusCode: 401,
                statusMessage: 'Unauthorized'
            })
        }
        await databases.deleteDocument(
            DATABASE_ID,
            TASKS_ID,
            taskId,
        );

        return {
            $id: task.$id
        }

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }
}); 