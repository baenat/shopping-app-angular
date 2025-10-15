import { Role } from "@products/interfaces/product.interface";

export interface User {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roles: Role[];
}
