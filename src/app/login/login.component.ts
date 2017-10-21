import { Component, OnInit } from '@angular/core';
import { Person } from '../person'; 
import { FormGroup, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})


export class LoginComponent implements OnInit {
  title = 'Inicio de Sesión';
  
  addForm: FormGroup;
  
    ngOnInit() {

    };

public loginForm = this.fb.group({
    email: ["", Validators.required],
    password: ["", Validators.required]
  });
  constructor(public fb: FormBuilder) {}
  doLogin(event) {
    console.log(event);
    console.log(this.loginForm.value);
  }
}


