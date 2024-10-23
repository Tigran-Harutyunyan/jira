import { createSessionClient, createAdminClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";

const { DATABASE_ID, MEMBERS_ID } = useRuntimeConfig();

export default defineEventHandler(async (event) => {

    try {
        const { account, databases } = await createSessionClient(event);
        const { users } = await createAdminClient();
        const user = await account.get();

        const params = event.context.params;

        const workspaceId = params && 'workspaceId' in params ? params.workspaceId : '';

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

        members = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [Query.equal("workspaceId", workspaceId)]
        );

        const populatedMembers = await Promise.all(
            members.documents.map(async (member) => {
                const user = await users.get(member.userId);

                return {
                    ...member,
                    name: user.name || user.email,
                    email: user.email,
                }
            })
        );

        return {
            ...members,
            documents: populatedMembers,
        };

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }
}); 