import { createSessionClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import { MemberRole } from "@/features/members/types";

const { DATABASE_ID, MEMBERS_ID } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    try {

        const { account, databases } = await createSessionClient(event);
        const user = await account.get();
        const params = event.context.params;
        const body = await readBody(event);
        const memberId = params && 'memberId' in body ? body.memberId : '';
        const role = params && 'role' in body ? body.role : '';

        const memberToUpdate = await databases.getDocument(
            DATABASE_ID,
            MEMBERS_ID,
            memberId,
        );

        const allMembersInWorkspace = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [Query.equal("workspaceId", memberToUpdate.workspaceId)]
        );

        const members = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [
                Query.equal("workspaceId", memberToUpdate.workspaceId),
                Query.equal("userId", user.$id),
            ],
        );

        const member = members.documents[0];

        if (!member) {
            return createError({
                statusCode: 401,
                statusMessage: 'Unauthorized'
            })
        }

        if (member.role !== MemberRole.ADMIN) {
            return createError({
                statusCode: 401,
                statusMessage: 'Unauthorized'
            })
        }

        if (allMembersInWorkspace.total === 1) {
            return createError({
                statusCode: 400,
                statusMessage: 'Cannot downgrade the only member'
            });
        }

        await databases.updateDocument(
            DATABASE_ID,
            MEMBERS_ID,
            memberId,
            {
                role,
            }
        );

        return { $id: memberToUpdate.$id };

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }
}); 