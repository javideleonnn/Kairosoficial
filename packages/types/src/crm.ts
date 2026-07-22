export type PermissionKey =
  | "leads:read:all"
  | "leads:read:assigned"
  | "leads:write"
  | "leads:assign"
  | "pipeline:manage"
  | "team:manage"
  | "settings:manage";

export interface Role {
  id: string;
  key: "owner" | "admin" | "advisor" | "viewer";
  permissions: PermissionKey[];
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  defaultLocale: string;
  plan: "starter" | "pro" | "agency";
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  roleId: string;
  status: "active" | "invited" | "suspended";
}

export interface PipelineStage {
  id: string;
  pipelineId: string;
  key: string;
  name: string;
  orderIndex: number;
  color: string;
}

export interface Tag {
  id: string;
  organizationId: string;
  name: string;
  color: string;
}

export interface Lead {
  id: string;
  organizationId: string;
  fullName: string;
  email: string | null;
  instagramUsername: string | null;
  phone: string | null;
  avatarUrl: string | null;
  currentStageId: string;
  assignedAdvisorId: string | null;
  lastInteractionAt: string | null;
  tags: Tag[];
  createdAt: string;
}

export type InteractionType =
  | "dm"
  | "call"
  | "email"
  | "whatsapp"
  | "stage_change"
  | "note";

export interface Interaction {
  id: string;
  leadId: string;
  type: InteractionType;
  direction: "inbound" | "outbound";
  content: string | null;
  occurredAt: string;
  createdBy: string | null;
}

export interface Note {
  id: string;
  leadId: string;
  authorId: string;
  content: string;
  isPrivate: boolean;
  createdAt: string;
}
