import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-userdata',
  templateUrl: './userdata.component.html',
  styleUrls: ['./userdata.component.scss']
})
export class UserdataComponent implements OnInit{
  userData!: FormGroup
  postUrl = 'http://localhost:7000/send'
  getUrl = 'http://localhost:7000/get'
  updateUrl = 'http://localhost:7000/update'
  deleteUrl = 'http://localhost:7000/delete'

  editMode: boolean = false;
  editUserId: number | null = null;

  

  constructor(private formBuilder: FormBuilder, private http: HttpClient){}

  ngOnInit(){
    this.createForm();
  }

  createForm(){
    this.userData = this.formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.minLength(10),
        // Validators.pattern(/^[A-Z][a-zA-Z\s']*$/) 
      ]],
      email: ['',
        [
          Validators.required,
          Validators.email,
          // Validators.pattern(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\w+([-.]\w+)*$/)
        ]
      ],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        // Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d\\S]{8,}$')
      ]],
      confPassword: ['',[
        // Validators.required,
        Validators.minLength(8),
        // Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d\\S]{8,}$')
      ]]
    });
  }
  

submitData() {
  if (!this.userData.valid) {
    console.log("Form is invalid.");
    return;
  }

  const formValue = this.userData.value
  if(this.editMode && this.editUserId !==null){
    const updateUserData = {
      id: this.editUserId,
      name: formValue.name,
      email: formValue.email,
      password: formValue.password
    };
    this.http.patch(this.updateUrl, updateUserData, { responseType: "text" }).subscribe({
      next: (res) => {
        console.log(res);
        this.editMode = false;
        this.editUserId = null;
        this.userData.reset();
        this.showData();
      },
      error: (err) => console.error(err)
    });
  }
else{
  this.http.post(this.postUrl, this.userData.value, { responseType: 'text' }).subscribe({
    next: (res) => console.log(`Data submit successfully: ${res}`),
    error: (err) => console.log(`Submit error: ${err}`)
  });
  this.userData.reset();
}
}

  dataListUser: any[]= []
  showData() {
    this.http.get<any[]>(this.getUrl).subscribe({
      next: (res) => {
        console.log('Get data:', res);
        this.dataListUser = res;
      },
      error: (err) => console.error('Error Get data:', err)
    });
  }


  updateData(user: any){
    this.userData.setValue({
    name: user.name,
    email: user.email,
    password: user.password,
    confPassword: user.password
  });
  this.editMode = true;
  this.editUserId = user.id;
  }

  deleteData(id: number){

    this.http.request('delete',this.deleteUrl,{
      body: {id},
      responseType: "text"
    }).subscribe({
      next: (res)=>{
        console.log(res);
        this.showData();
      },
      error: (err)=> console.log(err)
    })
  }
}
