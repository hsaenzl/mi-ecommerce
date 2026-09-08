import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environments';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  const reqConApiKey = req.clone({
    setHeaders: {
      apikey: environment.supabaseKey,
      Authorization: `Bearer ${environment.supabaseKey}`,
    },
  });
  return next(reqConApiKey);
};
