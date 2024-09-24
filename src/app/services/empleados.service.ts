import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }



  getEmpleados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/database`);
  }


  addEmpleado(empleado: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/database`, empleado);
  }

    // Eliminar un empleado por ID
    deleteEmpleado(id: number | string): Observable<any> {
      return this.http.delete<any>(`${this.apiUrl}/database/${id}`);
    }

    // Actualizar un empleado por ID
    updateEmpleado1(id: number | string, empleado: any): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/database/${id}`, empleado);
    }

    updateEmpleado(id: number | string, empleado: any): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/database/${id}`, empleado).pipe(
        map(response => {
          return { ...response, id }; // Asegúrate de devolver el ID si no está presente en la respuesta
        })
      );
    }


  getPlazas():Observable<any[]>{
       return this.http.get<any[]>(`${this.apiUrl}/plazas`)
    }

}
