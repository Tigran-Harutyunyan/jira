// Maps for route information
export const routeMetadata = {
    "workspaces-workspaceId-tasks-taskId": {
        title: "My Task",
        description: "Edit task details",
    },
    "workspaces-workspaceId-projects-projectId": {
        title: "My Project",
        description: "View tasks of your project here",
    },
    "workspaces-workspaceId": {
        title: "Home",
        description: "Monitor all of your projects and tasks here",
    },
} as const;

export const defaultMetadata = {
    title: "Home",
    description: "Monitor all of your projects and tasks here",
} as const;