import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { EmpleadosService } from '../../../services/empleados.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputTextareaModule, FileUploadModule,
    DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, InputNumberModule, AutoCompleteModule
  ],
  providers: [MessageService, ConfirmationService, EmpleadosService, ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',

})
export class HeaderComponent implements OnInit {
  currentUser: any;

  constructor(private empleadosService: EmpleadosService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private authService: AuthenticationService, private router: Router){}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    console.log('Usuario logueado actual:', this.currentUser);
  }


  logout(): void {
console.log('click')
    const currentUser = this.authService.getCurrentUser();
    const userName = currentUser ? currentUser.userName : 'este usuario';
    const mensaje = `¿Estás seguro de cerrar sesión como: ${userName}?`;
    this.confirmationService.confirm({
      message: mensaje,
      header: 'Confirmar Cierre de Sesión',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.authService.logout();
        this.router.navigateByUrl('/login');
        this.messageService.add({ severity: 'success', summary: 'Sesión cerrada', detail: 'Has cerrado sesión exitosamente.', life: 3000 });
        console.log('Sesión cerrada para el usuario:', userName);
      },
      reject: () => {

        this.messageService.add({ severity: 'info', summary: 'Acción cancelada', detail: 'El cierre de sesión ha sido cancelado.', life: 3000 });
        console.log('El usuario canceló el cierre de sesión.');
      }
    });
  }

}
