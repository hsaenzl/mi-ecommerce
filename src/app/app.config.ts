import { ApplicationConfig, provideBrowserGlobalErrorListeners, LOCALE_ID } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { registerLocaleData  } from '@angular/common';
import localeEsPE from '@angular/common/locales/es-PE';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

registerLocaleData(localeEsPE, 'es-PE');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    {provide: LOCALE_ID, useValue: 'es-PE' },
    provideHttpClient()
  ]
};
