import { createSessionClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import { MemberRole } from "@/features/members/types";

const { DATABASE_ID, WORKSPACES_ID, MEMBERS_ID } = useRuntimeConfig();

export default defineEventHandler(async (event) => {

    try {
        const { account, databases } = await createSessionClient(event);

        const user = await account.get();

        const params = event.context.params;

        const body = await readBody(event);

        const memberId = params && 'memberId' in body ? body.memberId : '';

        const memberToDelete = await databases.getDocument(
            DATABASE_ID,
            MEMBERS_ID,
            memberId,
        );

        const allMembersInWorkspace = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [Query.equal("workspaceId", memberToDelete.workspaceId)]
        );

        const members = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [
                Query.equal("workspaceId", memberToDelete.workspaceId),
                Query.equal("userId", user.$id),
            ],
        );

        const member = members.documents[0];

        if (member.$id !== memberToDelete.$id && member.role !== MemberRole.ADMIN) {
            return createError({
                statusCode: 401,
                statusMessage: 'Unauthorized'
            });
        }

        if (allMembersInWorkspace.total === 1) {
            return createError({
                statusCode: 400,
                statusMessage: 'Cannot delete the only member'
            });
        }

        await databases.deleteDocument(
            DATABASE_ID,
            WORKSPACES_ID,
            memberId,
        );

        return { $id: memberToDelete.$id };

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }
}); 