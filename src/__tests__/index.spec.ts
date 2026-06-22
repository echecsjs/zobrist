import { describe, expect, it } from 'vitest';

import { KEYS, castling, enPassant, piece, turn } from '../index.js';

import type { Square } from '../index.js';

describe('@echecs/zobrist', () => {
  describe('KEYS', () => {
    it('has exactly 781 values', () => {
      expect(KEYS).toHaveLength(781);
    });

    it('first value matches Polyglot spec', () => {
      expect(KEYS[0]).toBe(0x9d_39_24_7e_33_77_6d_41n);
    });

    it('last value matches Polyglot spec', () => {
      expect(KEYS[780]).toBe(0xf8_d6_26_aa_af_27_85_09n);
    });

    it('all values are non-zero', () => {
      for (const key of KEYS) {
        expect(key).not.toBe(0n);
      }
    });

    it('all values are unique', () => {
      const unique = new Set(KEYS);
      expect(unique.size).toBe(781);
    });
  });

  describe('piece', () => {
    it('returns correct key for black pawn on a1 (index 0)', () => {
      expect(piece('a1', 'pawn', 'black')).toBe(KEYS[0]);
    });

    it('returns correct key for white pawn on a1 (index 64)', () => {
      expect(piece('a1', 'pawn', 'white')).toBe(KEYS[64]);
    });

    it('returns correct key for black knight on a1 (index 128)', () => {
      expect(piece('a1', 'knight', 'black')).toBe(KEYS[128]);
    });

    it('returns correct key for white king on h8 (index 767)', () => {
      expect(piece('h8', 'king', 'white')).toBe(KEYS[767]);
    });
  });

  describe('turn', () => {
    it('returns KEYS[780] for white', () => {
      expect(turn('white')).toBe(KEYS[780]);
    });

    it('returns 0n for black', () => {
      expect(turn('black')).toBe(0n);
    });
  });

  describe('castling', () => {
    it('returns correct key for white kingside (index 768)', () => {
      expect(castling('white', 'king')).toBe(KEYS[768]);
    });

    it('returns correct key for white queenside (index 769)', () => {
      expect(castling('white', 'queen')).toBe(KEYS[769]);
    });

    it('returns correct key for black kingside (index 770)', () => {
      expect(castling('black', 'king')).toBe(KEYS[770]);
    });

    it('returns correct key for black queenside (index 771)', () => {
      expect(castling('black', 'queen')).toBe(KEYS[771]);
    });
  });

  describe('enPassant', () => {
    it('returns correct key for a-file (index 772)', () => {
      expect(enPassant('a')).toBe(KEYS[772]);
    });

    it('returns correct key for h-file (index 779)', () => {
      expect(enPassant('h')).toBe(KEYS[779]);
    });
  });

  describe('Polyglot test vectors', () => {
    it('starting position hash matches 0x463b96181691fc9c', () => {
      let h = 0n;

      h ^= piece('a8', 'rook', 'black');
      h ^= piece('b8', 'knight', 'black');
      h ^= piece('c8', 'bishop', 'black');
      h ^= piece('d8', 'queen', 'black');
      h ^= piece('e8', 'king', 'black');
      h ^= piece('f8', 'bishop', 'black');
      h ^= piece('g8', 'knight', 'black');
      h ^= piece('h8', 'rook', 'black');

      const blackPawnFiles = 'abcdefgh';
      for (const file of blackPawnFiles) {
        h ^= piece(`${file}7` as Square, 'pawn', 'black');
      }

      const whitePawnFiles = 'abcdefgh';
      for (const file of whitePawnFiles) {
        h ^= piece(`${file}2` as Square, 'pawn', 'white');
      }

      h ^= piece('a1', 'rook', 'white');
      h ^= piece('b1', 'knight', 'white');
      h ^= piece('c1', 'bishop', 'white');
      h ^= piece('d1', 'queen', 'white');
      h ^= piece('e1', 'king', 'white');
      h ^= piece('f1', 'bishop', 'white');
      h ^= piece('g1', 'knight', 'white');
      h ^= piece('h1', 'rook', 'white');

      h ^= turn('white');

      h ^= castling('white', 'king');
      h ^= castling('white', 'queen');
      h ^= castling('black', 'king');
      h ^= castling('black', 'queen');

      expect(h).toBe(0x46_3b_96_18_16_91_fc_9cn);
    });

    it('after 1.e4 hash matches 0x823c9b50fd114196', () => {
      let h = 0n;

      h ^= piece('a8', 'rook', 'black');
      h ^= piece('b8', 'knight', 'black');
      h ^= piece('c8', 'bishop', 'black');
      h ^= piece('d8', 'queen', 'black');
      h ^= piece('e8', 'king', 'black');
      h ^= piece('f8', 'bishop', 'black');
      h ^= piece('g8', 'knight', 'black');
      h ^= piece('h8', 'rook', 'black');

      const blackPawnFiles = 'abcdefgh';
      for (const file of blackPawnFiles) {
        h ^= piece(`${file}7` as Square, 'pawn', 'black');
      }

      const whitePawnFiles = 'abcdfgh';
      for (const file of whitePawnFiles) {
        h ^= piece(`${file}2` as Square, 'pawn', 'white');
      }
      h ^= piece('e4', 'pawn', 'white');

      h ^= piece('a1', 'rook', 'white');
      h ^= piece('b1', 'knight', 'white');
      h ^= piece('c1', 'bishop', 'white');
      h ^= piece('d1', 'queen', 'white');
      h ^= piece('e1', 'king', 'white');
      h ^= piece('f1', 'bishop', 'white');
      h ^= piece('g1', 'knight', 'white');
      h ^= piece('h1', 'rook', 'white');

      h ^= turn('black');

      h ^= castling('white', 'king');
      h ^= castling('white', 'queen');
      h ^= castling('black', 'king');
      h ^= castling('black', 'queen');

      expect(h).toBe(0x82_3c_9b_50_fd_11_41_96n);
    });

    it('after 1.e4 d5 hash matches 0x0756b94461c50fb0', () => {
      let h = 0n;

      h ^= piece('a8', 'rook', 'black');
      h ^= piece('b8', 'knight', 'black');
      h ^= piece('c8', 'bishop', 'black');
      h ^= piece('d8', 'queen', 'black');
      h ^= piece('e8', 'king', 'black');
      h ^= piece('f8', 'bishop', 'black');
      h ^= piece('g8', 'knight', 'black');
      h ^= piece('h8', 'rook', 'black');

      const blackPawnFiles = 'abcefgh';
      for (const file of blackPawnFiles) {
        h ^= piece(`${file}7` as Square, 'pawn', 'black');
      }
      h ^= piece('d5', 'pawn', 'black');

      const whitePawnFiles = 'abcdfgh';
      for (const file of whitePawnFiles) {
        h ^= piece(`${file}2` as Square, 'pawn', 'white');
      }
      h ^= piece('e4', 'pawn', 'white');

      h ^= piece('a1', 'rook', 'white');
      h ^= piece('b1', 'knight', 'white');
      h ^= piece('c1', 'bishop', 'white');
      h ^= piece('d1', 'queen', 'white');
      h ^= piece('e1', 'king', 'white');
      h ^= piece('f1', 'bishop', 'white');
      h ^= piece('g1', 'knight', 'white');
      h ^= piece('h1', 'rook', 'white');

      h ^= turn('white');

      h ^= castling('white', 'king');
      h ^= castling('white', 'queen');
      h ^= castling('black', 'king');
      h ^= castling('black', 'queen');

      expect(h).toBe(0x07_56_b9_44_61_c5_0f_b0n);
    });
  });
});
