export const recipeMealResponsiveChart = [
  {
    breakpoint: 370,
    options: {
      chart: {
        height: 80,
      },
    },
  },
  {
    breakpoint: 576,
    options: {
      chart: {
        height: 100,
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
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
    breakpoint: 768,
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
        height: 130,
      },
    },
  },
];
