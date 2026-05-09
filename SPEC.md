# SPEC.md — Polyglot Zobrist Hashing

Specification for the Zobrist hash key layout implemented by `@echecs/zobrist`.

**Source:** [Polyglot Book Format](http://hgm.nubati.net/book_format.html) by
Michel Van den Bergh.

---

## Overview

A Polyglot Zobrist hash uniquely identifies a chess position as a single 64-bit
unsigned integer. It is computed by XORing together one key for each aspect of
the position:

- one key per piece on each square
- one key for the side to move
- one key per castling right currently available
- one key for the en passant file (when applicable)

Because XOR is its own inverse, the hash can be updated incrementally: remove a
piece by XORing its key out, add a piece by XORing its key in.

---

## Key Table

781 64-bit random values (`bigint`) stored in a single flat array (`KEYS`),
indexed 0–780:

| Range   | Count | Meaning                                   |
| ------- | ----- | ----------------------------------------- |
| 0–767   | 768   | Piece-square keys (12 types × 64 squares) |
| 768–771 | 4     | Castling right keys                       |
| 772–779 | 8     | En passant file keys (files a–h)          |
| 780     | 1     | Turn key (side to move)                   |

---

## Piece Indexing

Piece-square keys occupy indices 0–767. The 12 piece kinds follow Polyglot
order, interleaving black and white for each piece type:

| kindIndex | Piece        |
| --------- | ------------ |
| 0         | black pawn   |
| 1         | white pawn   |
| 2         | black knight |
| 3         | white knight |
| 4         | black bishop |
| 5         | white bishop |
| 6         | black rook   |
| 7         | white rook   |
| 8         | black queen  |
| 9         | white queen  |
| 10        | black king   |
| 11        | white king   |

Square index is computed from rank and file (0-based, a1=0, h8=63):

```
squareIndex = rank * 8 + file
```

The flat array index for a piece is:

```
keyIndex = kindIndex * 64 + squareIndex
```

The `piece(square, type, color)` accessor encapsulates this formula.

---

## Turn Key

Key 780 is XORed into the hash when **white** is to move. When black is to move,
the turn contribution is `0` (no XOR applied).

```
turn('white') → KEYS[780]
turn('black') → 0n
```

---

## Castling Keys

One key per castling right. All four rights are independent:

| Index | Right           | FEN character |
| ----- | --------------- | ------------- |
| 768   | white kingside  | K             |
| 769   | white queenside | Q             |
| 770   | black kingside  | k             |
| 771   | black queenside | q             |

XOR each key for every right that is currently available. Removing a right (e.g.
after the king moves) means XORing its key out of the running hash.

---

## En Passant Keys

One key per file, for the file on which en passant capture is possible:

| Index | File |
| ----- | ---- |
| 772   | a    |
| 773   | b    |
| 774   | c    |
| 775   | d    |
| 776   | e    |
| 777   | f    |
| 778   | g    |
| 779   | h    |

**Polyglot convention:** the en passant key is XORed into the hash only when an
enemy pawn can actually capture on the en passant square — not merely because
the last move was a double pawn push. The consumer of this package is
responsible for applying this rule; `enPassant(file)` returns the raw key
without enforcing it.

---

## Hash Computation

```
hash = 0n

for each piece on the board:
  hash ^= piece(square, type, color)

hash ^= turn(sideToMove)

for each castling right in { white king, white queen, black king, black queen }:
  if right is available:
    hash ^= castling(color, side)

if en passant is possible and an enemy pawn can capture:
  hash ^= enPassant(file)
```

---

## API

| Export        | Signature                                                  | Returns             |
| ------------- | ---------------------------------------------------------- | ------------------- |
| `KEYS`        | `readonly bigint[]`                                        | Raw 781-value array |
| `piece()`     | `(square: Square, type: PieceType, color: Color) → bigint` | Piece-square key    |
| `turn()`      | `(color: Color) → bigint`                                  | Turn key            |
| `castling()`  | `(color: Color, side: CastlingSide) → bigint`              | Castling right key  |
| `enPassant()` | `(file: File) → bigint`                                    | En passant file key |
