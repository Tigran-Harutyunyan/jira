import { createSessionClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";

export default defineEventHandler(async (event) => {
    const { DATABASE_ID, PROJECTS_ID, MEMBERS_ID } = useRuntimeConfig();

    try {
        const { account, databases } = await createSessionClient(event);

        const params = event.context.params;

        const workspaceId = params && 'workspaceId' in params ? params.workspaceId : '';

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

        const projects = await databases.listDocuments(
            DATABASE_ID,
            PROJECTS_ID,
            [
                Query.equal("workspaceId", workspaceId),
                Query.orderDesc("$createdAt"),
            ],
        );


        return { projects };

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }
}); 