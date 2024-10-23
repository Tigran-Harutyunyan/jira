import { createSessionClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import { Project } from "@/features/projects/types";

const { DATABASE_ID, MEMBERS_ID, PROJECTS_ID } = useRuntimeConfig();

export default defineEventHandler(async (event) => {

    try {
        const { account, databases } = await createSessionClient(event);

        const user = await account.get();

        const params = event.context.params;

        const projectId = params && 'projectId' in params ? params.projectId : '';

        const existingProject = await databases.getDocument<Project>(
            DATABASE_ID,
            PROJECTS_ID,
            projectId,
        );

        const members = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [
                Query.equal("workspaceId", existingProject.workspaceId),
                Query.equal("userId", user.$id)
            ]
        );

        if (!members.documents[0]) {
            return createError({
                statusCode: 401,
                statusMessage: 'Unauthorized'
            })
        }

        await databases.deleteDocument(
            DATABASE_ID,
            PROJECTS_ID,
            projectId,
        );

        return { $id: existingProject.$id };

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }
}); 