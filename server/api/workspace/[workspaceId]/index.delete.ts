import { createSessionClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import { MemberRole } from "@/features/members/types";

const runtimeConfig = useRuntimeConfig();
const DATABASE_ID = runtimeConfig.APPWRITE_DATABASE_ID;
const WORKSPACES_ID = runtimeConfig.public.appwrite.APPWRITE_WORKSPACES_ID;
const MEMBERS_ID = runtimeConfig.public.appwrite.APPWRITE_MEMBERS_ID;

export default defineEventHandler(async (event) => {

    try {
        const { account, databases } = await createSessionClient(event);

        const user = await account.get();

        const params = event.context.params;


        const workspaceId = params && 'workspaceId' in params ? params.workspaceId : '';

        const members = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [Query.equal("userId", user.$id)]
        );

        const member = members.documents[0];

        if (!member || member.role !== MemberRole.ADMIN) {
            return createError({
                statusCode: 401,
                statusMessage: 'Unauthorized'
            })
        }

        // TODO: Delete members, projects, and tasks

        await databases.deleteDocument(
            DATABASE_ID,
            WORKSPACES_ID,
            workspaceId,
        );

        return { $id: workspaceId };

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }
}); 