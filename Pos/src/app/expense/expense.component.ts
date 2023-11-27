import { NgForm } from '@angular/forms';


import { Component } from '@angular/core';
@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})


export class ExpenseComponent {
  expenseName: string = '';
  expenseAmount: number = 0;
  expenseDate: Date = new Date(); 
  productName: string = '';
  category: string = '';
  HangMuc: string = '';
  currentDate: string; 
  allExpenses: any[] = [];
  constructor() {
    this.currentDate = new Date().toISOString().split('T')[0];
    this.expenseDate = new Date(); 
  }

  onCategoryChange() {
    const expenseCategoryField = document.getElementById('category') as HTMLSelectElement;
    const selectedValue = expenseCategoryField.value;
    const expenseField = document.getElementById('expenseAmount') as HTMLInputElement;

    if (selectedValue === 'Chi') {
      expenseField.style.borderColor = '#D83F31';
      expenseCategoryField.style.backgroundColor='#D83F31';
    } else if (selectedValue === 'Thu') {
      expenseCategoryField.style.backgroundColor='#219C90';
      expenseField.style.borderColor = '#219C90';
    } else {
      expenseField.style.borderColor = ''; 
    }
  }


  addExpense() {
    console.log('Expense Date:', this.expenseDate);
    const formData = [
      this.expenseDate, // Convert date to string format
      this.productName,
      this.category,
      this.expenseAmount,
      this.HangMuc
    ];
  
    const existingCSV = localStorage.getItem('detailExpenses');
  
    if (existingCSV) {
      let existingArray = JSON.parse(existingCSV) as any[];
      existingArray.push(formData);
      localStorage.setItem('detailExpenses', JSON.stringify(existingArray));
      console.log('Data appended to existing detailExpenses:', formData);
  } else {
    // Create a new 'detailExpenses' and add the data
    const newArray = [formData];
    localStorage.setItem('detailExpenses', JSON.stringify(newArray));
    console.log('New detailExpenses created with data:', formData);
  }
  
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', 'alert-success', 'mt-3');
    alertDiv.textContent = 'Successfully add expense!.';
    
    // Get the alert container
    const alertContainer = document.querySelector('.alert-container');
    alertContainer.appendChild(alertDiv);
  // Automatically remove the alert after 3 seconds (3000 milliseconds)
  setTimeout(() => {
    alertDiv.remove();
  }, 3000);

  // Reset form fields
  this.resetForm();
  }

  convertToCSV(data: any): string {
    const values = Object.values(data).join(',') + '\n';
    return values;
  }
 
  resetForm() {
    this.expenseName = '';
    this.expenseAmount = 0;
    this.expenseDate = new Date(); // Reset the date field
    this.productName = '';
    this.category = '';
    this.HangMuc='';
    const expenseCategoryField = document.getElementById('category') as HTMLSelectElement;
    expenseCategoryField.style.backgroundColor='white';
  }
}
