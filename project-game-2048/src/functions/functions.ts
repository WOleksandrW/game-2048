type ObjNumber = {
  [key: number]: number;
};
type ObjNumbers = {
  [key: number]: number[];
};

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function convertMatrix<T>(initMatrix: T[][]) {
  const matrix: T[][] = [];
  while (matrix.length < initMatrix[0].length) matrix.push([]);

  initMatrix.forEach((row, idxI) => {
    row.forEach((elem, idxJ) => {
      matrix[idxJ][idxI] = elem;
    });
  });

  return matrix;
}

function isPossibleToMerge(matrix: number[][]) {
  return matrix.some((row, idxRow) =>
    row.some((tile, idxTile) => {
      return (
        tile === matrix[idxRow][idxTile - 1] ||
        tile === matrix[idxRow][idxTile + 1] ||
        tile === (matrix[idxRow - 1] || [])[idxTile] ||
        tile === (matrix[idxRow + 1] || [])[idxTile]
      );
    })
  );
}

function mergeTilesInRow(row: number[]) {
  const tempRow = row.filter((tile) => tile !== 0);
  const mergedTilesObj: ObjNumber = {};
  for (let i = 0; i < tempRow.length - 1; i++) {
    if (tempRow[i] === tempRow[i + 1]) {
      mergedTilesObj[i] = ++tempRow[i];
      tempRow.splice(i + 1, 1);
    }
  }
  const newRow = tempRow.concat(new Array(row.length - tempRow.length).fill(0));
  return { newRow, mergedTilesObj };
}

function getTilePositions(array1: number[], array2: number[], mergedObj: ObjNumber) {
  const { values } = Object.entries(mergedObj).reduce(
    (acc, [key, merged]) => {
      const value = merged - 1;

      const maxUsedOldIdx = Math.max(...(acc.old[value] ?? [-1]));
      const idx1 = array1.indexOf(value, Math.max(+key, maxUsedOldIdx + 1));
      const idx2 = array1.indexOf(value, Math.max(+key, maxUsedOldIdx + 1, idx1 + 1));
      if (!acc.old[value]) acc.old[value] = [];
      acc.old[value].push(idx1, idx2);

      const maxUsedNewIdx = Math.max(...(acc.new[merged] ?? [-1]));
      const idxNew = array2.indexOf(merged, Math.max(+key, maxUsedNewIdx + 1));
      if (!acc.new[merged]) acc.new[merged] = [];
      acc.new[merged].push(idxNew);

      acc.values[idx1] = idxNew;
      acc.values[idx2] = idxNew;
      return acc;
    },
    { old: {}, new: {}, values: {} } as { old: ObjNumbers; new: ObjNumbers; values: ObjNumber }
  );

  array1.forEach((elem1, idx1) => {
    if (elem1 > 0 && values[idx1] === undefined) {
      let flag = false;
      array2.forEach((elem2, idx2) => {
        if (!flag && elem2 === elem1 && !Object.values(values).includes(idx2)) {
          values[idx1] = idx2;
          flag = true;
        }
      });
    }
  });

  return values;
}

function complexMoveComp(row: number[]) {
  const { newRow, mergedTilesObj } = mergeTilesInRow(row);
  const movedTilesObj =
    JSON.stringify(row) !== JSON.stringify(newRow)
      ? getTilePositions(row, newRow, mergedTilesObj)
      : {};

  return { newRow, mergedTilesObj, movedTilesObj };
}

export { getRandomNumber, convertMatrix, isPossibleToMerge, complexMoveComp };
