import { createSessionClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import { MemberRole } from "@/features/members/types";
import { Query } from "node-appwrite";

const runtimeConfig = useRuntimeConfig();
const DATABASE_ID = runtimeConfig.APPWRITE_DATABASE_ID;
const WORKSPACES_ID = runtimeConfig.public.appwrite.APPWRITE_WORKSPACES_ID;
const MEMBERS_ID = runtimeConfig.public.appwrite.APPWRITE_MEMBERS_ID;

export default defineEventHandler(async (event) => {

    const { workspaceId, inviteCode } = await readBody(event);

    try {
        const { account, databases } = await createSessionClient(event);

        const user = await account.get();

        const members = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [
                Query.equal("workspaceId", workspaceId),
                Query.equal("userId", user.$id),
            ],
        );

        if (members.documents[0]) {
            return createError({
                statusCode: 400,
                statusMessage: "Already a member"
            })
        }

        const workspace = await databases.getDocument(
            DATABASE_ID,
            WORKSPACES_ID,
            workspaceId
        );

        if (workspace.inviteCode !== inviteCode) {
            return createError({
                statusCode: 400,
                statusMessage: "Invalid invite code"
            })
        }

        await databases.createDocument(
            DATABASE_ID,
            MEMBERS_ID,
            ID.unique(),
            {
                workspaceId,
                userId: user.$id,
                role: MemberRole.MEMBER,
            },
        );

        return { workspace }
    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }
}); 