// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    // linear time complexity O(n)
    hasRowConflictAt: function(rowIndex) {
      var thisRow = this.rows()[rowIndex]
      if (thisRow.filter(function(value) {
        return value === 1
      }).length > 1) {
        return true; // fixme
      } else {
        return false;
      }
    },

    // test if any rows on this board contain conflicts
    // linear time complexity O(n)
    hasAnyRowConflicts: function() {
      for (let i = 0; i < this.rows().length; i++) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    // linear time complexity O(n)
    hasColConflictAt: function(colIndex) {
      let compareArr = [];
      for (let i = 0; i < this.rows().length; i++) {
        compareArr.push(this.rows()[i][colIndex])
      }
      if (compareArr.filter(value => value === 1).length > 1) {
        return true;
      }
      return false; // fixme
    },

    // test if any columns on this board contain conflicts
    // linear time complexity O(n)
    hasAnyColConflicts: function() {
      for (let i = 0; i < this.rows().length; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    // linear time complexity O(n)
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var index = majorDiagonalColumnIndexAtFirstRow;
      let compareArr = [];
      for (var i = 0; i < this.rows().length - index; i++) {
        compareArr.push(this.rows()[i][index]);
        index ++;
      }

      if (compareArr.filter(value => value === 1).length > 1) {
        return true;
      }
      return false;

    },

    // test if any major diagonals on this board contain conflicts
    // linear time complexity O(n)
    hasAnyMajorDiagonalConflicts: function() {
      var ndiff = this.rows().length + 1;
      var concatArray = '';
      for (let i = 0; i < this.rows().length; i++) {
        concatArray += this.rows()[i].join('');
      }
      concatArray = concatArray.split('');

      var indexOfFound = [];

      for (let i = 0; i < concatArray.length; i++) {
       if (concatArray[i] === '1') {
         indexOfFound.push(i + 1);
       }
      }

      indexOfFound.reverse();

      for (let i = 0; i < indexOfFound.length; i++){
        var start = indexOfFound[i];
        if (start % this.rows().length === 1){
          continue;
        }
        while (start > this.rows().length) {
          if (indexOfFound.includes(start - ndiff)){
            return true;
          }
          start -= ndiff;
          if (start % this.rows().length === 1) {
            start = 0;
          }
        }
      }

      return false;

      // var comparables = [];
      // var boardCopy = this.rows()
      // var columns = this.rows().length;
      // var index = 0;

      // function recurseBoard(array) {
      //   for (let i = 0; i <= columns.length - i; i++) {
      //     comparables.push(this.rows()[i][index]);
      //     index++
      //   }

      //   if (comparables.filter(value => value === 1).length > 1) {
      //     return true;
      //   }

      //   boardCopy.slice(1);
      //   index = 0;
      //   recurseBoard(boardCopy);
      //   console.log(boardCopy);
      // }
      // let boardCopy = this.rows();
      // let columns = this.rows().length;

      // while (boardCopy.length > 0) {
      //   let compareArr = [];
      //   let index = 0;
      //   for (let i = 0; i < boardCopy.length - i; i++) {
      //     compareArr.push(boardCopy[i][index]);
      //     index++;
      //   }

      //   if (compareArr.filter(value => value === 1).length > 1) {
      //     return true;
      //   }
      //   boardCopy = boardCopy.slice(1);
      //   console.log(boardCopy);
      //   console.log("compare" + compareArr);
      // }

      // var rotatedBoard = [];

      // for (let i = 0; i < this.rows().length; i++) {
      //   var rotated = [];
      //   for (let j = this.rows().length - 1; j <= 0; j--){
      //     rotated.push(this.rows()[i][j]);
      //     }
      //   rotatedBoard.push(rotated);
      //   rotated = [];
      // }

    },

    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    // linear time complexity O(n)
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {

      var index = minorDiagonalColumnIndexAtFirstRow;
      let compareArr = [];
      for (var i = 0; i < this.rows().length - index; i++) {
        compareArr.push(this.rows()[i][index]);
        index --;
      }

      if (compareArr.filter(value => value === 1).length > 1) {
        return true;
      }

      return false; // fixme

    },

    // test if any minor diagonals on this board contain conflicts
    // linear time complexity O(n)
    hasAnyMinorDiagonalConflicts: function() {
      var ndiff = this.rows().length - 1;
      var concatArray = '';
      for (let i = 0; i < this.rows().length; i++) {
        concatArray += this.rows()[i].join('');
      }
      concatArray = concatArray.split('');

      var indexOfFound = [];
      for (let i = 0; i < concatArray.length; i++) {
       if (concatArray[i] === '1') {
         indexOfFound.push(i + 1);
       }
      }

      indexOfFound.reverse();
      for (let i = 0; i < indexOfFound.length; i++){
        var start = indexOfFound[i];
        if (start % this.rows().length === 0) {
          continue;
        }
        while (start > this.rows().length) {
          if (indexOfFound.includes(start - ndiff)){
            return true;
          }
          start -= ndiff;
          if (start % this.rows().length === 0) {
            start = 0;
          }
        }
      }

      return false; // fixme

    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
