import { Router, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { EstadoConcherasComponent } from './pages/estado-concheras/estado-concheras.component';
import { ReporteComponent } from '../../cocheras-front/src/app/pages/reporte/reporte.component';
import { AuthService } from './service/auth.service';
import { inject } from '@angular/core';
import { ReportesComponent } from './pages/reportes/reportes.component';

function guardaLogueado() {
    let auth = inject(AuthService);
    let router = inject (Router);

    if (auth.estaLogueado())
        return true;
    else {
        router.navigate(['/login']);
        return false; 
    }
}

export const routes: Routes = [
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "estado-cocheras",
        component: EstadoConcherasComponent,
        canActivate:[guardaLogueado]
    },
    {
        path:"",
        redirectTo: "login",
        pathMatch: "full"
    },
    {
        path: "reportes",
        component:ReportesComponent 
    }
];
