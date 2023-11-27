import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ChartLoaderService } from '../services/chart-loader.service';

declare var Chart: any;



@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit {
  csvData: any[] = []; // Store CSV data here
  totalExpenses: number = 0;
  totalChi: number = 0;
  @ViewChild('chart') private chartRef!: ElementRef;

  constructor(
    private chartLoaderService: ChartLoaderService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.chartLoaderService.loadChartJs().then(() => {
      this.loadCSVDataFromLocalStorage();
    });
  }

  loadCSVDataFromLocalStorage() {
    const detailExpensesContent = localStorage.getItem('detailExpenses');
  
    if (detailExpensesContent) {
      const parsedData = JSON.parse(detailExpensesContent);
      if (Array.isArray(parsedData)) {
        this.csvData = parsedData;
        this.calculateTotalExpenses();
        this.calculateTotalChi();
        this.displayCSVDataTable();
        this.createChart();
        // Other functions for total expenses and table creation if needed
      } else {
        console.error('Data in detailExpenses is not in the expected format (array of arrays)');
      }
    } else {
      console.log('No detailExpenses data found in localStorage');
    }
  }

  createChart() {
    const dataByDate = {};
  
    // Calculate total expenses by date and category (Thu and Chi)
    this.csvData.forEach((entry) => {
      const date = entry[0]; // Date is at index 0
      const category = entry[2]; // Category is at index 2 (Thu or Chi)
      const expense = parseFloat(entry[3]); // Expense amount is at index 3
  
      if (!dataByDate[date]) {
        dataByDate[date] = {
          Thu: 0,
          Chi: 0
        };
      }
  
      dataByDate[date][category] += expense;
    });
  
    let labels = Object.keys(dataByDate);
  
    // Convert date strings to Date objects and sort the labels array by date in ascending order
    labels.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  
    const dataThu = labels.map(date => dataByDate[date]?.Thu || 0);
    const dataChi = labels.map(date => dataByDate[date]?.Chi || 0);
  
    // Create the chart only if the chartRef is available
    if (this.chartRef && this.chartRef.nativeElement) {
      const ctx = this.chartRef.nativeElement.getContext('2d');
      const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Thu',
              data: dataThu,
              backgroundColor: 'rgba(37, 82, 109, 0.5)',
              borderColor: 'white',
              borderWidth: 1
            },
            {
              label: 'Chi',
              data: dataChi,
              backgroundColor: 'rgba(95, 22, 90, 0.5)',
              borderColor: 'white',
              borderWidth: 1
            }
          ]
        }
      });
    }
  }
  
  
calculateTotalExpenses(): void {
  this.totalExpenses = 0;
    for (let i = 0; i < this.csvData.length; i++) {
      if(this.csvData[i][2]=== 'Thu'){
      const amount = parseFloat(this.csvData[i][3] || '0'); // Assuming the expense amount is in the fourth column (index 3)
      this.totalExpenses += amount;
    }
}}

calculateTotalChi(): void {
  this.totalChi = 0;
    for (let i = 0; i < this.csvData.length; i++) {
      if(this.csvData[i][2]=== 'Chi'){
      const amount = parseFloat(this.csvData[i][3] || '0'); // Assuming the expense amount is in the fourth column (index 3)
      this.totalChi += amount;
    }
}}
displayCSVDataTable(): void {
  this.csvData.sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());

  if (this.csvData && this.csvData.length > 0 && !this.csvData.some(row => row.some(value => value !== ""))) {
    const tableElement = document.getElementById('csvDataTable');
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
editedRowIndex: number = -1;
editedRow: any = {};
showModal: boolean = false;
editRow(index: number) {
  this.editedRowIndex = index;
  this.editedRow = { ...this.csvData[index] }; // Make a copy of the selected row
  this.showModal = true;
}

saveEditedRow() {
  this.csvData[this.editedRowIndex] = { ...this.editedRow };
  this.closeModal();
}

closeModal() {
  this.showModal = false;
  this.editedRowIndex = -1;
  this.editedRow = {};
}

deleteRow(index: number) {
  this.csvData.splice(index, 1);
  localStorage.setItem('detailExpenses', JSON.stringify(this.csvData));
}

}


