import { createSessionClient, createAdminClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import { type Project } from "@/features/projects/types";
import { type Task } from "@/features/tasks/types";

const { DATABASE_ID, WORKSPACES_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    try {
        const { account, databases } = await createSessionClient(event);
        const { users } = await createAdminClient();

        let user = await account.get();
        const params = event.context.params;
        const workspaceId = params && 'workspaceId' in params ? params.workspaceId : '';
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

        const project = await databases.getDocument<Project>(
            DATABASE_ID,
            PROJECTS_ID,
            task.projectId
        );

        const member = await databases.getDocument(
            DATABASE_ID,
            MEMBERS_ID,
            task.assigneeId
        );

        user = await users.get(member.userId);

        const assignee = {
            ...member,
            name: user.name || user.email,
            email: user.email,
        };

        return {
            ...task,
            project,
            assignee,
        }

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }
}); 