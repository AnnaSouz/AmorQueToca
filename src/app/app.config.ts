import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: 'AIzaSyDHanPfGHHB-hcHO4Xb8QHOkfltALpq-eg',
        authDomain: 'amor-que-toca.firebaseapp.com',
        projectId: 'amor-que-toca',
        storageBucket: 'amor-que-toca.firebasestorage.app',
        messagingSenderId: '254844340074',
        appId: '1:254844340074:web:5bdc616c84517ba28a4713',
        measurementId: 'G-F5KV3HEX6Q',
      }),
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
