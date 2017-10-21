import { Component, OnInit } from '@angular/core';
import { Person } from '../person'; 
import { FormGroup, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  title = 'Registrarse';
  
  addForm: FormGroup;
  
    ngOnInit() {

    };

public registerForm = this.fb.group({
    name: ["",Validators.required],
    lastname: ["",Validators.required],
    place: ["",Validators.required],
    email: ["", Validators.required],
    password: ["", Validators.required]
  });
  constructor(public fb: FormBuilder) {}
  doRegister(event) {
    console.log(event);
    console.log(this.registerForm.value);
  }
}
