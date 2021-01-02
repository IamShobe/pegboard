import { getRandomColor, isOnEdge, LEFT_EDGE, RIGHT_EDGE, TOP_EDGE, BOTTOM_EDGE } from './utils';


const START_SIDE = 1
const END_SIDE = 2

const constraintTo = (side, deltaX, srcX, srcSize, maxX) => {
  let xToRet = srcX
  let sizeToRet = srcSize
  if (side === START_SIDE) { 
    if (deltaX < 0 && xToRet + deltaX < 0) {
      deltaX = -xToRet;
    } else if (deltaX > 0 && sizeToRet - deltaX < 1) {
      deltaX = sizeToRet - 1;
    }
    xToRet += deltaX;
    sizeToRet -= deltaX;
  } else if (side == END_SIDE) {
    if (deltaX > 0 && sizeToRet + xToRet + deltaX > maxX) {
      deltaX = maxX - xToRet - sizeToRet;
    } else if (deltaX < 0 && sizeToRet + deltaX < 1){
      deltaX = 1 - sizeToRet;
    }

    sizeToRet += deltaX;
  }

  return {
    x: xToRet,
    size: sizeToRet,
  };
}

export const calculateResize = (src, onEdge, x, y, boardSize, isDown) => {
  let { x: newX, y: newY, width: newWidth, height: newHeight } = src;


  let newXDim = {x: newX, size: newWidth}, 
      newYDim = {x: newY, size: newHeight};
  if (onEdge & LEFT_EDGE) {
    newXDim = constraintTo(START_SIDE, x, src.x, src.width, boardSize.x);
  } else if (onEdge & RIGHT_EDGE) {
    newXDim = constraintTo(END_SIDE, x, src.x, src.width, boardSize.x);
  }
  if (onEdge & TOP_EDGE) {
    newYDim = constraintTo(START_SIDE, y, src.y, src.height, boardSize.y);
  } else if (onEdge & BOTTOM_EDGE) {
    newYDim = constraintTo(END_SIDE, y, src.y, src.height, boardSize.y);
  }
  newX = newXDim.x;
  newWidth = newXDim.size;
  newY = newYDim.x;
  newHeight = newYDim.size;

  return {
    ...src,
    x: newX,
    y: newY,
    width: newWidth,
    height: newHeight,
  };
}

export const createCollisionBoard = (sizeX, sizeY, currentIndex, objects) => {
  const board = [];
  for (let x = 0; x < sizeX; x++) {
    board[x] = new Array(sizeY);
  }

  objects.forEach((obj, index) => {
    if (currentIndex === index) {
      // skip current moving obj
      return
    }
    for (let x = obj.x; x < obj.x + obj.width; x++) {
      for (let y = obj.y; y < obj.y + obj.height; y++) {
        board[x][y] = index;
      }
    }
  });
  return board
}


export const checkCollisions = (movingObj, board) => {
  for (let x = movingObj.x; x < movingObj.x + movingObj.width; x++) {
    for (let y = movingObj.y; y < movingObj.y + movingObj.height; y++) {
      if(board[x][y] !== undefined) {
        return true;
      }
    }
  }
  return false;  
}