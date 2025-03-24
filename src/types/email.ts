export interface EmailAccount {
    id: string;
    email: string;
    username: string;
    created_at: string;
    status: 'active' | 'inactive';
}

export interface CreateEmailAccountDTO {
    active: number;
    local_part: string;
    name: string;
    quota: number;
    force_pw_update: string;
    password1: string;
    password2: string;
    tls_enforce_in: number;
    tls_enforce_out: number;
    domain: string;
    tags: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
} 