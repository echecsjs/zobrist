import { KEYS } from './keys.js';

import type { CastlingSide, Color, File, PieceType, Square } from './types.js';

const CASTLING_INDEX: Record<`${Color}.${CastlingSide}`, number> = {
  'black.king': 770,
  'black.queen': 771,
  'white.king': 768,
  'white.queen': 769,
};

const COLOR_PIVOT: Record<Color, number> = {
  black: 0,
  white: 1,
};

const EP_INDEX: Record<File, number> = {
  a: 772,
  b: 773,
  c: 774,
  d: 775,
  e: 776,
  f: 777,
  g: 778,
  h: 779,
};

const PIECE_TYPE: Record<PieceType, number> = {
  bishop: 3,
  king: 6,
  knight: 2,
  pawn: 1,
  queen: 5,
  rook: 4,
};

function castling(color: Color, side: CastlingSide): bigint {
  return KEYS[CASTLING_INDEX[`${color}.${side}`]] ?? 0n;
}

function enPassant(file: File): bigint {
  return KEYS[EP_INDEX[file]] ?? 0n;
}

function piece(square: Square, type: PieceType, color: Color): bigint {
  const file = (square.codePointAt(0) ?? 0) - 97;
  const rank = Number(square.at(1)) - 1;
  const squareIndex = rank * 8 + file;
  const kindIndex = (PIECE_TYPE[type] - 1) * 2 + COLOR_PIVOT[color];

  return KEYS[kindIndex * 64 + squareIndex] ?? 0n;
}

function turn(color: Color): bigint {
  return color === 'white' ? (KEYS[780] ?? 0n) : 0n;
}

export { castling, enPassant, piece, turn };

export type {
  CastlingSide,
  Color,
  File,
  PieceType,
  Rank,
  Square,
} from './types.js';

export { KEYS } from './keys.js';
