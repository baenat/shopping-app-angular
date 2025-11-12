import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthResponse } from '@auth/interfaces/auth-response';
import { User } from '@auth/interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

enum AuthStatus {
  Checking = "checking",
  Authenticated = "authenticated",
  NotAuthenticated = "not-authenticated",
}

type AuthStatusType = `${AuthStatus}`;

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _authStatus = signal<AuthStatusType>(AuthStatus.Checking);
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(null);

  private _httpClient = inject(HttpClient);

  authStatus = computed<AuthStatusType>(() => {
    if (this.authStatus() === AuthStatus.Checking) return AuthStatus.Checking;

    if (this._user()) return AuthStatus.Authenticated;

    return AuthStatus.Checking
  });

  login(email: string, password: string): Observable<boolean> {
    return this._httpClient.post<AuthResponse>(`${baseUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => this.userLoggedIn(response)),
        map(() => true),
        catchError((error: any) => {
          this.userLoggedOut();
          return of(false);
        })
      );
  }

  private userLoggedIn(response: AuthResponse) {
    this._authStatus.set(AuthStatus.Authenticated);
    this._user.set(response.user);
    this._token.set(response.token);

    localStorage.setItem('token', response.token);
  }

  private userLoggedOut() {
    this._authStatus.set(AuthStatus.NotAuthenticated);
    this._user.set(null);
    this._token.set(null);
  }

}
