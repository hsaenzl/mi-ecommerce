import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken() ?? environment.supabaseKey;

  const reqConApiKey = req.clone({
    setHeaders: {
      apikey: environment.supabaseKey,
      Authorization: `Bearer ${token}`,
    },
  });
  return next(reqConApiKey);
};
