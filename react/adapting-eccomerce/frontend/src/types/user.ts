export interface Address {
    id: string;
    user_id: string;
    country: string;
    full_address: string;
    postal_code: number;
}
export type ChangeAddress = Omit<Address, "id" | "user_id">;

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    default_address: Address | null;
}
