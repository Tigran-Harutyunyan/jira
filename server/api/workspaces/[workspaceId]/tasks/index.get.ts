import { createSessionClient, createAdminClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import { type Project } from "@/features/projects/types";
import { type Task } from "@/features/tasks/types";
import { useQuery } from "@tanstack/vue-query";

const { DATABASE_ID, WORKSPACES_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    try {
        const { account, databases } = await createSessionClient(event);
        const { users } = await createAdminClient();

        const user = await account.get();
        const params = event.context.params;
        const { status, assigneeId, projectId, dueDate, search } = await getQuery(event)

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

        const query = [
            Query.equal("workspaceId", workspaceId),
            Query.orderDesc("$createdAt")
        ];

        if (projectId) {
            query.push(Query.equal("projectId", projectId));
        }

        if (status) {
            query.push(Query.equal("status", status));
        }

        if (assigneeId) {
            query.push(Query.equal("assigneeId", assigneeId));
        }

        if (dueDate) {
            query.push(Query.equal("dueDate", dueDate));
        }

        if (search) {
            query.push(Query.search("name", search));
        }

        const tasks = await databases.listDocuments<Task>(
            DATABASE_ID,
            TASKS_ID,
            query,
        );

        const projectIds = tasks.documents.map((task) => task.projectId);
        const assigneeIds = tasks.documents.map((task) => task.assigneeId);

        const projects = await databases.listDocuments<Project>(
            DATABASE_ID,
            PROJECTS_ID,
            projectIds.length > 0 ? [Query.contains("$id", projectIds)] : [],
        );

        members = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : [],
        );

        const assignees = await Promise.all(
            members.documents.map(async (member) => {
                const user = await users.get(member.userId);

                return {
                    ...member,
                    name: user.name || user.email,
                    email: user.email,
                }
            })
        );

        const populatedTasks = tasks.documents.map((task) => {
            const project = projects.documents.find(
                (project) => project.$id === task.projectId,
            );
            const assignee = assignees.find(
                (assignee) => assignee.$id === task.assigneeId,
            );

            return {
                ...task,
                project,
                assignee,
            };
        });

        return [...populatedTasks];

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }
}); 