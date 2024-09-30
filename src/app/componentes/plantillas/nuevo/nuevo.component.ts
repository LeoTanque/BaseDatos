import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nuevo',
  standalone: true,
  imports: [CommonModule ,HeaderComponent, RouterModule],
  templateUrl: './nuevo.component.html',
  styleUrl: './nuevo.component.scss'
})
export class NuevoComponent implements OnInit {

constructor(){}

  ngOnInit(): void {

  }

}
