# @echecs/zobrist

[![Spec](https://img.shields.io/badge/Spec-Polyglot-green.svg)](SPEC.md)

The 781 [Polyglot](http://hgm.nubati.net/book_format.html) standard Zobrist hash
keys for chess positions. Zero dependencies, strict TypeScript.

## Install

```bash
npm install @echecs/zobrist
```

## Quick Start

```typescript
import { castling, enPassant, piece, turn } from '@echecs/zobrist';

// Compute the Polyglot hash for the starting position
let hash = 0n;

// XOR piece-square keys for all 32 pieces
hash ^= piece('e1', 'king', 'white');
hash ^= piece('d1', 'queen', 'white');
// ... all other pieces ...

// XOR the turn key (only when white to move)
hash ^= turn('white');

// XOR castling rights
hash ^= castling('white', 'king');
hash ^= castling('white', 'queen');
hash ^= castling('black', 'king');
hash ^= castling('black', 'queen');

// XOR en passant file (only if an enemy pawn can capture)
// hash ^= enPassant('e');

console.log(hash.toString(16)); // '463b96181691fc9c'
```

## API

### `piece(square, type, color)`

Returns the Zobrist key for a piece on a square.

- `square` — Board square (`'a1'` through `'h8'`)
- `type` — Piece type (`'pawn'` | `'knight'` | `'bishop'` | `'rook'` | `'queen'`
  | `'king'`)
- `color` — Side (`'white'` | `'black'`)

### `turn(color)`

Returns the side-to-move key. Per the Polyglot spec, the key is included only
when white is to move. Returns `0n` for black.

### `castling(color, side)`

Returns the castling right key.

- `color` — `'white'` | `'black'`
- `side` — `'king'` | `'queen'`

### `enPassant(file)`

Returns the en passant file key.

- `file` — `'a'` through `'h'`

Per the Polyglot spec, include this only if a pawn of the side to move is
adjacent to the en passant target square.

### `KEYS`

The raw 781-value `readonly bigint[]` array for direct Polyglot index access.
Layout: `[0..767]` piece-square, `[768..771]` castling, `[772..779]` en passant,
`[780]` turn.

## Types

```typescript
type CastlingSide = 'king' | 'queen';
```

Castling side — kingside or queenside.

```typescript
type Color = 'black' | 'white';
```

Side to move.

```typescript
type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
```

Board file (column).

```typescript
type PieceType = 'bishop' | 'king' | 'knight' | 'pawn' | 'queen' | 'rook';
```

Chess piece type.

```typescript
type Rank = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
```

Board rank (row).

```typescript
type Square = `${File}${Rank}`;
```

A board square — combination of `File` and `Rank`, e.g. `'e4'`.

## Polyglot Layout

| Subarray     | Offset | Length | Description                 |
| ------------ | ------ | ------ | --------------------------- |
| Piece-square | 0      | 768    | 12 piece kinds x 64 squares |
| Castling     | 768    | 4      | White K/Q, Black K/Q        |
| En passant   | 772    | 8      | Files a through h           |
| Turn         | 780    | 1      | XOR when white to move      |

**Piece kind index:** `(pieceType - 1) * 2 + colorPivot`

| Kind   | Black | White |
| ------ | ----- | ----- |
| Pawn   | 0     | 1     |
| Knight | 2     | 3     |
| Bishop | 4     | 5     |
| Rook   | 6     | 7     |
| Queen  | 8     | 9     |
| King   | 10    | 11    |

**Square index:** `rank * 8 + file` (a1=0, b1=1, ..., h8=63)

## License

MIT
