import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ChartLoaderService } from '../services/chart-loader.service';

declare var Chart: any;



@Component({
  selector: 'app-weekmanagement',
  templateUrl: './weekmanagement.component.html',
  styleUrls: ['./weekmanagement.component.scss']
})

export class WeekmanagementComponent implements OnInit {
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
    const dataByWeek = {};
  
    // Calculate total expenses by date and category (Thu and Chi)
    this.csvData.forEach((entry) => {
      const date = new Date(entry[0]); // Date is at index 0
      const category = entry[2]; // Category is at index 2 (Thu or Chi)
      const expense = parseFloat(entry[3]); // Expense amount is at index 3
  
      // Get the week number of the year for the date
      const weekNumber = this.getWeekNumber(date);
      const year = date.getFullYear();
  
      const label = `Tuần ${weekNumber} của năm ${year}`;
  
      if (!dataByWeek[label]) {
        dataByWeek[label] = {
          Thu: 0,
          Chi: 0
        };
      }
  
      dataByWeek[label][category] += expense;
    });
  
    // Get the keys (labels) and sort them in ascending order
    let labels = Object.keys(dataByWeek).sort((a, b) => {
      const [weekA, yearA] = this.getWeekAndYear(a);
      const [weekB, yearB] = this.getWeekAndYear(b);
  
      if (yearA !== yearB) {
        return yearA - yearB;
      }
  
      return weekA - weekB;
    });
  
    const dataThu = labels.map(label => dataByWeek[label]?.Thu || 0);
    const dataChi = labels.map(label => dataByWeek[label]?.Chi || 0);
  
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
        },
        options: {
          tooltips: {
            callbacks: {
              label: (tooltipItem, data) => {
                const label = data.labels[tooltipItem.index];
                return `Custom text: ${label} - Value: ${tooltipItem.yLabel}`;
              }
            }
          }
        }
      });
    }
  }
  
  getWeekAndYear(label: string): [number, number] {
    const parts = label.match(/(\d+)/g); // Extracts all numbers from the label
    if (parts && parts.length >= 2) {
      const week = parseInt(parts[0]);
      const year = parseInt(parts[1]);
      return [week, year];
    }
    return [0, 0]; // Default values if parsing fails
  }
  // Function to get the week number of the year
  
  
  
  
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
  this.csvData.forEach((row: any) => {
    const date = new Date(row[0]); // Assuming date is at index 0
    const weekNumber = this.getWeekNumber(date);
    row.push(weekNumber); // Push the week number to the row
  });

  // Sort the data by the added weekNumber column (assuming it's added at the last index)
  this.csvData.sort((a: any, b: any) => a[a.length - 1] - b[b.length - 1]);

  // Check if the data is empty and scroll to the table
  if (this.csvData && this.csvData.length > 0 && !this.csvData.some((row: any) => row.some((value: any) => value !== ""))) {
    const tableElement = document.getElementById('csvDataTable');
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

// Function to get the week number of the year
getWeekNumber(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const difference = date.getTime() - startOfYear.getTime();
  const oneWeek = 604800000; // Milliseconds in one week
  return Math.ceil(difference / oneWeek);
}
getYearFromDateString(dateString: string): number {
  const year = new Date(dateString).getFullYear();
  return year;
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