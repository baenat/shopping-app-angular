import { inject } from "@angular/core";
import { CanMatchFn, Route, Router, UrlSegment } from "@angular/router";
import { AuthService } from "@auth/services/auth.service";
import { Role } from "@products/interfaces/product.interface";
import { firstValueFrom } from "rxjs";

export const isAdminGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  await firstValueFrom(authService.checkAuthStatus());
  const isAdmin = authService.user()?.roles.includes(Role.Admin) ?? false;

  if (!isAdmin) {
    router.navigateByUrl('/');
    return false;
  }

  return true;
};

