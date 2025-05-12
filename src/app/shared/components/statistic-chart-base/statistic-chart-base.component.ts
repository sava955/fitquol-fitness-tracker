export abstract class BaseStatisticChartComponent<T> {
  series: { name: string; data: number[] }[] = [];
  categories: string[] = [];
  loading = false;

  abstract extractSeries(data: T[]): { name: string; data: number[] }[];
  abstract formatCategory(item: T): string;

  setChart(data: T[]): void {
    if (!data?.length) {
      this.series = [];
      this.categories = [];
      return;
    }

    this.series = this.extractSeries(data);
    this.categories = data.map(this.formatCategory);
  }
}
