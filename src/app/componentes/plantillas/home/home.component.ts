import { EmpleadosService } from './../../../services/empleados.service';
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






interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule,
    DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, InputNumberModule, AutoCompleteModule],
  providers: [MessageService, ConfirmationService, EmpleadosService, ],
  templateUrl: './home.component.html',
  //styleUrl: './home.component.scss',
   styles: [
        `:host ::ng-deep .p-dialog .product-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }`
    ]
})
export class HomeComponent implements OnInit{

  empleadoDialog: boolean = false;
  empleados!:any[]
  empleado:any
  selectedEmpleados!: any[] | null;
  submitted: boolean = false;
  statuses!: any[];

  currentUser: any;
  edadOriginal: number | null = null;


  //plazas: any[] | undefined;

  plazas:any[]=[]

  selectedPlaza: any;

  filteredPlazas!: any[]

constructor(private empleadosService: EmpleadosService, private messageService: MessageService,
  private confirmationService: ConfirmationService, private authService: AuthenticationService, private router: Router){}


  ngOnInit(): void {
    this.empleadosService.getEmpleados().subscribe({
      next: (data) => {
        this.empleados = data;
        console.log('Empleados:', this.empleados);
      },
      error: (err) => {
        console.error('Error al obtener empleados', err);
      }
    });

    this.statuses = [
      { label: 'INSTOCK', value: 'instock' },
      { label: 'LOWSTOCK', value: 'lowstock' },
      { label: 'OUTOFSTOCK', value: 'outofstock' }
  ];

  this.currentUser = this.authService.getCurrentUser();
  console.log('Usuario logueado actual:', this.currentUser);

  this.cargarPlazas()





  }


  cargarPlazas() {
    this.empleadosService.getPlazas().subscribe((datos: any[]) => {
      this.plazas = datos;
      console.log('plazas', this.plazas)
    });
  }

  filtrarPlaza1(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.plazas as any[]).length; i++) {
        let country = (this.plazas as any[])[i];
        if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(country);
        }
    }

    this.filteredPlazas = filtered;
}


filtrarPlaza(event: any) {
  const query = event.query.toLowerCase();
  this.empleadosService.getPlazas().subscribe((plazas: any[]) => {
      this.filteredPlazas = plazas.filter(plaza => plaza.name.toLowerCase().includes(query));
  });
}


  openNew() {
    this.empleado = {};
    this.submitted = false;
    this.edadOriginal = this.empleado.edad;
    this.empleadoDialog = true;
}


deleteSelectedEmpleados() {
  // Obtener los nombres de los empleados seleccionados
  const empleadosSeleccionadosNombres = this.selectedEmpleados?.map(empleado => empleado.nombre).join(', ');

  // Personalizar el mensaje según la cantidad de empleados seleccionados
  const mensaje = this.selectedEmpleados?.length === 1
    ? `¿Estás seguro de eliminar al empleado: ${empleadosSeleccionadosNombres}?`
    : `¿Estás seguro de eliminar a los empleados: ${empleadosSeleccionadosNombres}?`;

  // Mostrar el cuadro de confirmación con los nombres de los empleados seleccionados
  this.confirmationService.confirm({
    message: mensaje,
    header: 'Confirmar',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      // Iterar sobre los empleados seleccionados para eliminarlos
      this.selectedEmpleados?.forEach((empleado) => {
        this.empleadosService.deleteEmpleado(empleado.id).subscribe({
          next: () => {
            this.empleados = this.empleados.filter(val => val.id !== empleado.id);
          },
          error: (err) => {
            console.error('Error al eliminar empleado', err);
          }
        });
      });

      // Limpiar la selección y mostrar mensaje de éxito
      this.selectedEmpleados = null;
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Empleados eliminados', life: 3000 });
    }
  });
}




editEmpleado(empleado: any) {
  this.empleado = { ...empleado };
  this.empleadoDialog = true;
}


deleteEmpleado(empleado: any) {
  this.confirmationService.confirm({
    message: '¿Estás seguro de eliminar a ' + empleado.nombre + '?',
    header: 'Confirmar',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.empleadosService.deleteEmpleado(empleado.id).subscribe({
        next: () => {
          this.empleados = this.empleados.filter(val => val.id !== empleado.id);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Empleado Eliminado', life: 3000 });
        },
        error: (err) => {
          console.error('Error al eliminar empleado', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el empleado', life: 3000 });
        }
      });
    }
  });
}

hideDialog() {
  this.empleadoDialog = false;
  this.submitted = false;
}



calcularEdad(): void {
  if (!this.empleado.CI || this.empleado.CI.length < 6) {
    this.empleado.edad = null;
    return;
  }

  // Extraer los primeros 6 dígitos del CI (YYMMDD)
  const year = parseInt(this.empleado.CI.substring(0, 2), 10);
  const month = parseInt(this.empleado.CI.substring(2, 4), 10) - 1; // Los meses en JavaScript empiezan desde 0
  const day = parseInt(this.empleado.CI.substring(4, 6), 10);

  // Asumir que los años < 50 son del siglo XXI y >= 50 son del siglo XX
  const fullYear = year < 50 ? 2000 + year : 1900 + year;

  // Crear la fecha de nacimiento
  const birthDate = new Date(fullYear, month, day);
  const today = new Date();

  // Calcular la edad
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // Ajustar si el cumpleaños no ha ocurrido este año
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  this.empleado.edad = age;
}




saveEmpleado() {
  this.submitted = true;
  if (this.empleado.id && this.edadOriginal !== null) {
    // Si la edad cambió y el CI no fue modificado, mostrar mensaje de advertencia
    if (this.empleado.edad !== this.edadOriginal && !this.empleado.CI?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'La edad depende del CI. Para cambiar la edad, debe ingresar un CI válido.',
        life: 3000
      });
      return; // Detener el guardado hasta que el CI sea modificado
    }
  }

  if (this.empleado.nombre?.trim()) {
    if (this.empleado.id) {
      this.empleadosService.updateEmpleado(this.empleado.id, this.empleado).subscribe({
        next: (data) => {
          const index = this.findIndexById(this.empleado.id);
          this.empleados[index] = data;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Empleado editado', life: 3000 });

          this.empleadoDialog = false;
          this.empleado = {};
        },
        error: (err) => {
          console.error('Error al editar empleado', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo editar el empleado', life: 3000 });
        }
      });
    } else {
      //this.empleado.id = this.createId();
      this.empleadosService.addEmpleado(this.empleado).subscribe({
        next: (data) => {

          this.empleados.push(data);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Empleado creado', life: 3000 });

          this.empleadoDialog = false;
          this.empleado = {};
        },
        error: (err) => {
          console.error('Error al agregar empleado', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar el empleado', life: 3000 });
        }
      });
    }
  }
}


saveEmpleado1() {
  this.submitted = true;

  // Verificar si está editando el empleado
  if (this.empleado.id && this.edadOriginal !== null) {
    // Si la edad cambió y el CI no fue modificado, mostrar mensaje de advertencia
    if (this.empleado.edad !== this.edadOriginal && !this.empleado.CI?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'La edad depende del CI. Para cambiar la edad, debe ingresar un CI válido.',
        life: 3000
      });
      return; // Detener el guardado hasta que el CI sea modificado
    }
  }

  if (this.empleado.nombre?.trim()) {
    if (this.empleado.id) {
      // Editar empleado
      this.empleadosService.updateEmpleado(this.empleado.id, this.empleado).subscribe({
        next: (data) => {
          const index = this.findIndexById(this.empleado.id);
          this.empleados[index] = data;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Empleado editado', life: 3000 });

          this.empleadoDialog = false;
          this.empleado = {};
        },
        error: (err) => {
          console.error('Error al editar empleado', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo editar el empleado', life: 3000 });
        }
      });
    } else {
      // Crear nuevo empleado
      this.empleadosService.addEmpleado(this.empleado).subscribe({
        next: (data) => {
          this.empleados.push(data);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Empleado creado', life: 3000 });

          this.empleadoDialog = false;
          this.empleado = {};
        },
        error: (err) => {
          console.error('Error al agregar empleado', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar el empleado', life: 3000 });
        }
      });
    }
  }
}


findIndexById(id: string): number {
  return this.empleados.findIndex(empleado => empleado.id === id);
}

createId(): string {
  let id = '';
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

onGlobalFilter(table: Table, event: Event) {
  table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
}




logout(): void {
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
