import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AuthenticationService } from '../../../services/authentication.service';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, InputTextModule, ButtonModule,
    CheckboxModule,PasswordModule, ToastModule, RippleModule  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService]
})
export  class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private messageService: MessageService
  ) { }


  ngOnInit(): void {

     this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });


  }




  onLogin1(): void {
    if (this.loginForm.valid) {
      const auth = this.loginForm.value;
      this.authService.login(auth).subscribe({
        next: (user) => {
          if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.messageService.add({
              severity: 'success',
              summary: 'Login Exitoso',
              detail: 'Has iniciado sesión correctamente.'
            });
            this.router.navigate(['/home']);
          }
        },
        error: (err) => {
          // Mostrar el mensaje adecuado según el error
          let errorMessage = 'Error desconocido.';

          if (err.message === 'Usuario no registrado') {
            errorMessage = 'El usuario no está registrado.';
          } else if (err.message === 'Credenciales incorrectas') {
            errorMessage = 'La contraseña es incorrecta.';
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Error de Login',
            detail: errorMessage,
          });
        }
      });
    } else {
      this.showValidationErrors();
    }
  }

  onLogin0(): void {
    if (this.loginForm.valid) {
      const auth = this.loginForm.value;
      this.authService.login(auth).subscribe({
        next: (user) => {
          if (user) {
            // El token se almacena automáticamente al iniciar sesión exitosamente
            this.messageService.add({
              severity: 'success',
              summary: 'Login Exitoso',
              detail: 'Has iniciado sesión correctamente.'
            });

            // Redirigir al home después de un login exitoso
            this.router.navigate(['/home']);
          }
        },
        error: (err) => {
          let errorMessage = 'Error desconocido.';

          if (err.message === 'Usuario no registrado') {
            errorMessage = 'El usuario no está registrado.';
          } else if (err.message === 'Credenciales incorrectas') {
            errorMessage = 'La contraseña es incorrecta.';
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Error de Login',
            detail: errorMessage,
          });
        }
      });
    } else {
      this.showValidationErrors();
    }
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const auth = this.loginForm.value;
      console.log('Intentando iniciar sesión con:', auth); // Logueamos los datos del intento de login

      this.authService.login(auth).subscribe({
        next: (user) => {
          if (user) {
            this.messageService.add({
              severity: 'success',
              summary: 'Login Exitoso',
              detail: 'Has iniciado sesión correctamente.'
            });
            console.log('Redirigiendo al Home'); // Logueamos la redirección
            this.router.navigate(['/home']);
          }
        },
        error: (err) => {
          let errorMessage = 'Error desconocido.';
          if (err.message === 'Usuario no registrado') {
            errorMessage = 'El usuario no está registrado.';
          } else if (err.message === 'Credenciales incorrectas') {
            errorMessage = 'La contraseña es incorrecta.';
          }
          console.log('Error en el login:', errorMessage); // Logueamos el error que ocurrió
          this.messageService.add({
            severity: 'error',
            summary: 'Error de Login',
            detail: errorMessage,
          });
        }
      });
    } else {
      this.showValidationErrors();
    }
  }


  showValidationErrors(): void {
    if (this.loginForm.get('userName')?.errors?.['required']) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campo requerido',
        detail: 'Debe ingresar un nombre de usuario.'
      });
    }

    else if (this.loginForm.get('password')?.errors?.['required']) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campo requerido',
        detail: 'Debe ingresar una contraseña.'
      });
    } else if (this.loginForm.get('password')?.errors?.['minlength']) {
      this.messageService.add({
        severity: 'error',
        summary: 'Contraseña inválida',
        detail: 'La contraseña debe tener al menos 6 caracteres.'
      });
    }
  }

}
