import { createSessionClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";

const { DATABASE_ID, WORKSPACES_ID, MEMBERS_ID } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    try {
        const { account, databases } = await createSessionClient(event);

        const user = await account.get();

        const members = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [Query.equal("userId", user.$id)]
        );

        if (members.total === 0) {
            return {
                data: { documents: [], total: 0 }
            };
        }

        const workspaceIds = members.documents.map((member) => member.workspaceId);

        const workspaces = await databases.listDocuments(
            DATABASE_ID,
            WORKSPACES_ID,
            [
                Query.orderDesc("$createdAt"),
                Query.contains("$id", workspaceIds)
            ],
        );

        return { data: workspaces };

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }
}); 