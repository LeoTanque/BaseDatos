import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Login } from '../interfaces/login';
import { Users } from '../interfaces/users';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl = 'http://localhost:3000';
  private currentUserKey = 'currentUser';

  constructor(private http: HttpClient) { }
 // token ='' ;
  token = localStorage.getItem('token') || '';

  isAuth(): boolean {
    return !!localStorage.getItem(this.currentUserKey);
  }
  isAuth1() {
    // Comprobar si existe un token en el localStorage
    return localStorage.getItem('token') !== null;
  }





  login(userData: Login): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`).pipe(
      map(users => {
        const user = users.find(user => user.userName === userData.userName);

        if (!user) {
          throw new Error('Usuario no registrado');
        }

        if (user.password !== userData.password) {
          throw new Error('Credenciales incorrectas');
        }

        // Guardamos al usuario en localStorage
        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        console.log('Login exitoso:', user); // Logueamos el usuario con el que se inició sesión
        return user;
      }),
      catchError(error => {
        console.log('Error en el login:', error.message); // Logueamos el error si ocurre
        return throwError(error);
      })
    );
  }


  logout() {
    console.log('Cerrando sesión del usuario:', this.getCurrentUser());
    localStorage.removeItem('token');
    localStorage.removeItem(this.currentUserKey);
    console.log('Logout exitoso.');
  }


  getCurrentUser(): any {
    const user = localStorage.getItem(this.currentUserKey);
    return user ? JSON.parse(user) : null;
  }


  signup(userData: Users): Observable<any> {
    console.log('Registrando nuevo usuario:', userData);
    return this.http.post<any>(`${this.apiUrl}/usuarios`, userData);
  }
}
