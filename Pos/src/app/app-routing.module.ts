import { DefaultLayoutComponent } from './core/layouts/default-layout/default-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';
import { HomeComponent } from './views/public/home/home.component';
import { PosComponent } from './views/public/pos/pos.component';
import { LoginComponent } from './views/public/auth/login/login.component';
import { RegisterComponent } from './views/public/auth/register/register.component';
import { AppLayoutComponent } from './core/layouts/app-layout/app-layout.component';
import { ExpenseComponent } from './expense/expense.component';
import { ManagementComponent } from './management/management.component';
import { WeekmanagementComponent } from './weekmanagement/weekmanagement.component';
import { MonthmanagementComponent } from './monthmanagement/monthmanagement.component';
import { QuartermanagementComponent } from './quartermanagement/quartermanagement.component';
import { CategorymanagementComponent } from './categorymanagement/categorymanagement.component';


const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'dashboard',
        component: ManagementComponent,
      },
      {
        path: 'dashboard-week',
        component: WeekmanagementComponent,
      },
      {
        path: 'dashboard-month',
        component: MonthmanagementComponent,
      },
      {
        path: 'dashboard-quarter',
        component: QuartermanagementComponent,
      }
      ,
      {
        path: 'dashboard-category',
        component: CategorymanagementComponent,
      }
      ,
      {
        path: 'add-expense',
        component: ExpenseComponent,
      },

    ]
  },
  {
    path: 'admin',
    component: AppLayoutComponent,
    canActivate: [AngularFireAuthGuard],
    loadChildren: () => import('./views/private/private-routing.module').then(m => m.PrivateRoutingModule)
  },
  { path: "**", redirectTo: "/home" },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
