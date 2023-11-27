import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ChartLoaderService } from '../services/chart-loader.service';

declare var Chart: any;


@Component({
  selector: 'app-monthmanagement',
  templateUrl: './monthmanagement.component.html',
  styleUrls: ['./monthmanagement.component.scss']
})
export class MonthmanagementComponent implements OnInit {
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
    const dataByMonth = {};
  
    // Calculate total expenses by date and category (Thu and Chi)
    this.csvData.forEach((entry) => {
      const date = new Date(entry[0]); // Date is at index 0
      const category = entry[2]; // Category is at index 2 (Thu or Chi)
      const expense = parseFloat(entry[3]); // Expense amount is at index 3
  
      const month = date.getMonth() + 1; // Month starts from 0 (January is 0)
      const year = date.getFullYear();
  
      const label = `Tháng ${month} của năm ${year}`;
  
      if (!dataByMonth[label]) {
        dataByMonth[label] = {
          Thu: 0,
          Chi: 0
        };
      }
  
      dataByMonth[label][category] += expense;
    });
  
    // Get the keys (labels) and sort them in ascending order
    let labels = Object.keys(dataByMonth).sort((a, b) => {
      const [monthA, yearA] = this.getMonthAndYear(a);
      const [monthB, yearB] = this.getMonthAndYear(b);
  
      if (yearA !== yearB) {
        return yearA - yearB;
      }
  
      return monthA - monthB;
    });
  
    const dataThu = labels.map(label => dataByMonth[label]?.Thu || 0);
    const dataChi = labels.map(label => dataByMonth[label]?.Chi || 0);
  
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
  
  getMonthAndYear(label: string): [number, number] {
    const parts = label.match(/(\d+)/g); // Extracts all numbers from the label
    if (parts && parts.length >= 2) {
      const month = parseInt(parts[0]);
      const year = parseInt(parts[1]);
      return [month, year];
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
    const month = date.getMonth() + 1; // Month starts from 0 (January is 0)
    const year = date.getFullYear();
    const monthString = `${month}-${year}`; // Create label in 'MM-YYYY' format

    row.push(monthString); // Push the month label to the row
  });

  // Sort the data by the added month column (assuming it's added at the last index)
  this.csvData.sort((a: any, b: any) => {
    const monthA = a[a.length - 1]; // Assuming the month is the last item in the row
    const monthB = b[b.length - 1];

    if (monthA < monthB) return -1;
    if (monthA > monthB) return 1;
    return 0;
  });

  // Check if the data is empty and scroll to the table
  if (this.csvData && this.csvData.length > 0 && !this.csvData.some((row: any) => row.some((value: any) => value !== ""))) {
    const tableElement = document.getElementById('csvDataTable');
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
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