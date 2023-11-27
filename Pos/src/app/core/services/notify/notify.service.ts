import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor() { }

  error(x){
    Swal.fire({
      title: x.code,
      text: x.message,
      icon: "error",
    });
  }
  success(message: string): void {
    Swal.fire({
      title: 'Success',
      text: message,
      icon: 'success',
    });
  }
  error2(a : string){
    Swal.fire({
      title: "Oup's",
      text: a,
      icon: "error",
    });
  }
}
