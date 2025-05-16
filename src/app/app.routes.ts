import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NewBudgetComponent } from './components/home/new-budget/new-budget.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path:  'home', component: HomeComponent },
    { path: 'newBudget', component: NewBudgetComponent }
];
