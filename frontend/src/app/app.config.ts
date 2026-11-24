import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    //parameter arrives as a component .any route parameter is automatically passed to a component input with the same name.
    provideRouter(routes, withComponentInputBinding())
  ]
};
