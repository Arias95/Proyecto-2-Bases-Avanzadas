import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { Routes, RouterModule }  from '@angular/router';


const routes: Routes = [
  // map '/persons' to the people list component
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
];

export const appRouterModule = RouterModule.forRoot(routes);

