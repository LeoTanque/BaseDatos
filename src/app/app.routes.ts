import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/auth/login/login.component';
import { RegistroComponent } from './componentes/auth/registro/registro.component';
import { HomeComponent } from './componentes/plantillas/home/home.component';
import { NuevoComponent } from './componentes/plantillas/nuevo/nuevo.component';
import { authGuardGuard } from './guard/auth-guard.guard';
import { authRedirectGuard } from './guard/authRedirectGuard';

export const routes: Routes = [
  {path:'', redirectTo:'login', pathMatch:'full'},
  {path:'login', component:LoginComponent, canActivate: [authRedirectGuard] },
  {path:'registro', component:RegistroComponent, canActivate: [authRedirectGuard] },
  {path: 'home', component: HomeComponent, canActivate:[authGuardGuard] },
  {path: 'nuevo', component: NuevoComponent, canActivate:[authGuardGuard]},
  {path: '**', redirectTo: 'login' }




];
