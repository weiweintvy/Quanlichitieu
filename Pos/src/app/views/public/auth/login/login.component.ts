import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FieldConfig, FormConfig } from 'ngx-nomad-form';
import { AuthenticationService, NotifyService } from 'src/app/core/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formConfig: FormConfig = {
    name: 'loginForm',
    enctype: 'text/plain',
  };

  //My fields
  fields: FieldConfig[] = [{
    type: 'input',
    label: 'Email address',
    inputType: 'email',
    name: 'email',
    col: 12,
    validations: [{
      name: 'required',
      validator: Validators.required,
      message: 'Email is required'
    }]
  },{
    type: 'input',
    label: 'Password',
    inputType: 'password',
    name: 'password',
    col: 12,
    validations: [{
      name: 'required',
      validator: Validators.required,
      message: 'Password is required'
    }]
  },  {
    type: 'button',
    color: 'primary',
    label: 'login',
    col: 12
  }];

  constructor(private formBuilder: FormBuilder,
    private AuthenticationService: AuthenticationService,
    private router: Router,
    private notify : NotifyService) { }


    //Tạo ra một mảng userList gồm 2 giá trị mặc định
    //mảng này sẽ được lưu trên lCalSr với biến UserList
  ngOnInit() {
    const storedUserList = JSON.parse(localStorage.getItem('userList') || '[]');
    if (storedUserList.length === 0) {
      const userList = [
        { email: 'admin@itc.com', password: 'admin' },
      ];
      localStorage.setItem('userList', JSON.stringify(userList));
    }
    var r = this.AuthenticationService.checkIfUserIsConnected();
    r ? this.redirect() : null;
  }

  callBack(formData: any){
    this.auth(formData);
  }

  private auth(formData){
    console.log(formData);
    const storedUserList = JSON.parse(localStorage.getItem('userList') || '[]');
    const matchedUser = storedUserList.find(
      (user) => user.email === formData.email && user.password === formData.password
    );
    if (matchedUser) {
      this.notify.success('Đăng nhập thành công khoản thành công!');
      this.router.navigate(['/dashboard']);
    }
    else {
      // Authentication failed
      this.notify.error({ code: 'Thất bại', message: 'Tài khoản hoặc mật khẩu không chính xác!' });
      console.log('Invalid credentials');
    }
  }

  redirect(){
    this.router.navigateByUrl('admin/dashboard', {
      state: {reload: true}
  });
 }
}
