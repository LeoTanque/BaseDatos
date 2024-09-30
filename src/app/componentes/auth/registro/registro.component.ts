import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AuthenticationService } from '../../../services/authentication.service';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { passwordsMatchValidator } from '../../../interfaces/passwordsMatchValidator';
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, InputTextModule, ButtonModule,
    CheckboxModule,PasswordModule, ToastModule,RippleModule ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss',
  providers: [MessageService]
})
export class RegistroComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: passwordsMatchValidator('password', 'confirmPassword')
    });
  }


  onSignup() {
    if (this.signupForm.valid) {
      const password = this.signupForm.get('password')?.value;
      const confirmPassword = this.signupForm.get('confirmPassword')?.value;

      if (confirmPassword === '') {


        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe llenar el campo de confirmar contraseña.' });
        return; // Detener la ejecución del método
      }

      if (password !== confirmPassword) {
        // Contraseñas no coinciden, mostrar SweetAlert

        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden..' });

        return; // Detener la ejecución del método
      }

      const registro = { ...this.signupForm.value };
      console.log('registro', registro)
      this.authService.signup(registro).subscribe(response => {
        console.log('Usuario registrado:', response);

        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Usuario registrado con éxito.' });
        this.signupForm.reset();
        this.router.navigate(['/login']);
      });
    } else {
      // Manejar errores de validación
      if (this.signupForm.get('name')?.errors?.['required']) {
        this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Debe ingresar un nombre' });
        console.log('Debe ingresar un nombre.');
      } else if (this.signupForm.get('name')?.errors?.['pattern']) {
        console.log('El nombre debe ser un string.');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El nombre debe ser un string.' });
      } else if (this.signupForm.get('userName')?.errors?.['required']) {
        this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Debe ingresar un nombre de usuario.' });
        console.log('Debe ingresar un nombre de usuario.');

      } else if (this.signupForm.get('password')?.errors?.['required']) {
        this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Debe ingresar una contraseña.' });
        console.log('Debe ingresar una contraseña.');
      } else if (this.signupForm.get('password')?.errors?.['minlength']) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La contraseña debe tener al menos 6 caracteres.' });
        console.log('La contraseña debe tener al menos 6 caracteres.');
      } else if (this.signupForm.get('confirmPassword')?.errors?.['required']) {
        this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Debe llenar el campo de confirmar contraseña.' });
        console.log('Debe llenar el campo de confirmar contraseña.');
      } else if (this.signupForm.get('confirmPassword')?.errors?.['passwordsNotMatch']) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden.' });
        console.log('Las contraseñas no coinciden.');
      } else {
        console.log('Error desconocido.');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error desconocido' });
      }
    }
  }

}
