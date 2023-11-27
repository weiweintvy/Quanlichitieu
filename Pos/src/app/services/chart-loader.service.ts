// chart-loader.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartLoaderService {
  private chartJsLoaded: boolean = false;

  loadChartJs(): Promise<void> {
    if (this.chartJsLoaded) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => {
        this.chartJsLoaded = true;
        resolve();
      };
      script.onerror = () => reject('Failed to load Chart.js');
      document.body.appendChild(script);
    });
  }
}
