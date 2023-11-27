import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ChartLoaderService } from '../services/chart-loader.service';

declare var Chart: any;

@Component({
  selector: 'app-categorymanagement',
  templateUrl: './categorymanagement.component.html',
  styleUrls: ['./categorymanagement.component.scss']
})
export class CategorymanagementComponent implements OnInit {
  csvData: any[] = [];
  categories: string[] = ["Giáo dục", "Y tế", "Du lịch", "Tiết kiệm", "Đầu tư", "Nhu cầu thiết yếu", "Thiện Nguyện"];
  totalExpenses: number = 0;
  totalChi: number = 0;
  @ViewChild('chartRefThu', { static: true }) chartRefThu: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartRefChi', { static: true }) chartRefChi: ElementRef<HTMLCanvasElement>;

  constructor(
    private chartLoaderService: ChartLoaderService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.chartLoaderService.loadChartJs().then(() => {
      this.loadCSVDataFromLocalStorage();
    });
  }
 // láy các tham số trong detailExpenses chuyển dữ liệu về mảng
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
      } else {
        console.error('Data in detailExpenses is not in the expected format (array of arrays)');
      }
    } else {
      console.log('No detailExpenses data found in localStorage');
    }
  }

  createChart() {
    const categories = ["Giáo dục", "Y tế", "Du lịch", "Tiết kiệm", "Đầu tư", "Nhu cầu thiết yếu", "Thiện Nguyện"];
    const dataByCategory = {};

    categories.forEach(category => {
      dataByCategory[category] = {
        Thu: 0,
        Chi: 0
      };
    });
      this.csvData.forEach((entry) => {
      const category = entry[4];
      const expense = parseFloat(entry[3]);
      const type = entry[2];
      if (categories.includes(category)) {
        dataByCategory[category][type] += expense;
      }
    });
      const dataThu = categories.map(category => dataByCategory[category].Thu);
    const dataChi = categories.map(category => dataByCategory[category].Chi);
      const createDoughnutChart = (data, backgroundColor, label, canvasRef) => {
      if (canvasRef && canvasRef.nativeElement) {
        const ctx = canvasRef.nativeElement.getContext('2d');
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: categories,
            datasets: [
              {
                label: label,
                data: data,
                backgroundColor: backgroundColor,
                borderColor: 'white',
                borderWidth: 1
              }
            ]
          },
          options: {
          }
        });
      }
    };

    if (this.chartRefThu && this.chartRefThu.nativeElement) {
      createDoughnutChart(dataThu, this.generateCategoryColors(categories.length), 'Thu', this.chartRefThu);
    }

    if (this.chartRefChi && this.chartRefChi.nativeElement) {
      createDoughnutChart(dataChi, this.generateCategoryColors(categories.length), 'Chi', this.chartRefChi);
    }
  }

  generateCategoryColors(numColors: number): string[] {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const hue = (i * 360) / numColors;
      const color = `hsl(${hue}, 70%, 50%,0.6)`;
      colors.push(color);
    }
    return colors;
  }

  getClassBasedOnCategoryColorIndex(category: string, categories: string[]): string {
    const colors = this.generateCategoryColors(categories.length);
    const categoryIndex = categories.indexOf(category);
    if (categoryIndex !== -1) {
      return `color-${categoryIndex}`;
    }
    return '';
  }
//phân loại là thu hay chi
calculateTotalExpenses(): void {
  this.totalExpenses = 0;
    for (let i = 0; i < this.csvData.length; i++) {
      if(this.csvData[i][2]=== 'Thu'){
      const amount = parseFloat(this.csvData[i][3] || '0');
      this.totalExpenses += amount;
    }
}}

calculateTotalChi(): void {
  this.totalChi = 0;
    for (let i = 0; i < this.csvData.length; i++) {
      if(this.csvData[i][2]=== 'Chi'){
      const amount = parseFloat(this.csvData[i][3] || '0');
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
  this.editedRow = { ...this.csvData[index] };
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
getColorForCategory(category: string): string {
  const categories = ["Giáo dục", "Y tế", "Du lịch", "Tiết kiệm", "Đầu tư", "Nhu cầu thiết yếu", "Thiện Nguyện"];
  const categoryIndex = categories.indexOf(category);
  const colors = this.generateCategoryColors(categories.length);

  if (categoryIndex !== -1) {
    return colors[categoryIndex];
  }
  return '';
}
}
