export interface Product {
    id: string;
    name: string;
    description: string;
    provider: string;
    category: string;
    price: number;
    created_at: string;
    image_url: string | null;
}
