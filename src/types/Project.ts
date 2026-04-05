type ProjectStatus = 'draft' | 'published' | 'archived';

export interface Project {
    id: number;
    title: string;
    description: string;
    longDescription: string;
    tags: string[];
    githubUrl: string;
    demoUrl: string;
    imageUrl: string;
    status: ProjectStatus;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// export type SortField = 'updatedAt' | 'createdAt' | 'title';
// export type SortOrder = 'asc' | 'desc';
// export type FilterStatus = 'all' | ProjectStatus;
