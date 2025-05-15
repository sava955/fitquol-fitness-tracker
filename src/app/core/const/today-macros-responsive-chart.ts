export const todayMacrosResponsiveChart = [
  {
    breakpoint: 400,
    options: {
      chart: {
        height: 120,
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              offsetY: 0,
              fontSize: '12px',
            },
            value: {
              offsetY: 2,
              fontSize: '12px',
            },
          },
        },
      },
    },
  },
  {
    breakpoint: 576,
    options: {
      chart: {
        height: 150,
      },
    },
  },
  {
    breakpoint: 768,
    options: {
      chart: {
        height: 200,
      },
    },
  },
  {
    breakpoint: 992,
    options: {
      chart: {
        height: 120,
      },
    },
  },
  {
    breakpoint: 1200,
    options: {
      chart: {
        height: 120,
      },
    },
  },
];
