// utils/gridUtils.ts
export function calculateGrid(imagesPerPage: number): { rows: number; cols: number } {
  switch (imagesPerPage) {
    case 1:
      return { rows: 1, cols: 1 };
    case 2:
      return { rows: 1, cols: 2 };
    case 4:
      return { rows: 2, cols: 2 };
    case 6:
      return { rows: 2, cols: 3 };
    case 9:
      return { rows: 3, cols: 3 };
    default:
      const cols = Math.ceil(Math.sqrt(imagesPerPage));
      const rows = Math.ceil(imagesPerPage / cols);
      return { rows, cols };
  }
}
