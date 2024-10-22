import { createSessionClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig();

    const DATABASE_ID = runtimeConfig.APPWRITE_DATABASE_ID;
    const WORKSPACES_ID = runtimeConfig.public.appwrite.APPWRITE_WORKSPACES_ID;
    const MEMBERS_ID = runtimeConfig.public.appwrite.APPWRITE_MEMBERS_ID;

    try {
        const { account, databases } = await createSessionClient();

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