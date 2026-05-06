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
