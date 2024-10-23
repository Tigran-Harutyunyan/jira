import { createSessionClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";

const { DATABASE_ID, PROJECTS_ID, MEMBERS_ID } = useRuntimeConfig();

import { type Project } from "@/features/projects/types";

export default defineEventHandler(async (event) => {

    try {
        const { account, databases } = await createSessionClient(event);

        const params = event.context.params;

        const workspaceId = params && 'workspaceId' in params ? params.workspaceId : '';
        const projectId = params && 'projectId' in params ? params.projectId : '';

        if (!workspaceId) {
            return createError({
                statusCode: 400,
                statusMessage: 'Missing workspaceId'
            })
        }

        const user = await account.get();

        const members = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [Query.equal("userId", user.$id)]
        );

        if (!members.documents[0]) {
            return createError({
                statusCode: 401,
                statusMessage: 'Unauthorized'
            });
        }

        const project = await databases.getDocument<Project>(
            DATABASE_ID,
            PROJECTS_ID,
            projectId,
        );

        return { project };

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }
}); 