import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FieldConfig, FormConfig } from 'ngx-nomad-form';
import { AuthenticationService, NotifyService } from 'src/app/core/services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  formConfig: FormConfig = {
    name: 'registerForm',
    enctype: 'text/plain',
  };

  // Registration form fields with full name, email, and password
  fields: FieldConfig[] = [
    {
      type: 'input',
      label: 'Full Name',
      inputType: 'text',
      name: 'fullName',
      col: 12,
      validations: [{
        name: 'required',
        validator: Validators.required,
        message: 'Full Name is required'
      }]
    },
    {
      type: 'input',
      label: 'Email Address',
      inputType: 'email',
      name: 'email',
      col: 12,
      validations: [{
        name: 'required',
        validator: Validators.required,
        message: 'Email is required'
      }, {
        name: 'email',
        validator: Validators.email,
        message: 'Enter a valid email address'
      }]
    },
    {
      type: 'input',
      label: 'Password',
      inputType: 'password',
      name: 'password',
      col: 12,
      validations: [{
        name: 'required',
        validator: Validators.required,
        message: 'Password is required'
      }, {
        name: 'minlength',
        validator: Validators.minLength(6),
        message: 'Password must be at least 6 characters long'
      }]
    },
    {
      type: 'button',
      color: 'primary',
      label: 'Register',
      col: 12
    }
  ];

  constructor(private formBuilder: FormBuilder,
    private AuthenticationService: AuthenticationService,
    private router: Router,
    private notify: NotifyService) { }

    ngOnInit() {
      // Add your initialization logic here
      // This space intentionally left blank
    }


  callBack(formData: any) {
    // Retrieve user list from local storage
    const storedUserList = JSON.parse(localStorage.getItem('userList') || '[]');

    // Hàm này kiểm tra xem email đã được cung cấp có tồn tại trong danh sách người dùng không
    const userExists = storedUserList.some((user: any) => user.email === formData.email);

    if (userExists) {
      this.notify.error({ code: 'Đã đăng ký', message: 'Người dùng đã được đăng ký!' });

    } else {
      // Thêm người dùng mới vào danh sách người dùng
      storedUserList.push(formData);

      // Lưu trữ danh sách người dùng đã được cập nhật vào local storage
      localStorage.setItem('userList', JSON.stringify(storedUserList));
      this.notify.success('Đăng ký tài khoản thành công!');

      // Thực hiện các hành động bổ sung (ví dụ: chuyển hướng đến trang mới)
      this.router.navigate(['/home']); // Chuyển hướng đến trang đăng nhập sau khi đăng ký
    }

  }
}
