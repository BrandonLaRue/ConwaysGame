app.controller('MainController', ['$scope', '$timeout', '$interval', function($scope, $timeout, $interval) {
	// set page title
	$scope.title = 'Game of Life';


	// set width and height of world
	var height = 35;
	var width = 35;

	// set delay between world updates
	var delay = 500;

	// bound sets ratio of live to dead, should be between 0 and 1
	var bound = 0.75;

	var makeWorldArray = function(h, w) {
		// set up array to hold game state as multidimensional array of height x width
		var a = [];
		var row = [];
		// set up single row with all values as false
		for(var i = 0; i < width; i++) {
			row[i] = false;
		}
		// set up multidimensional array with identical empty rows
		for(var i = 0; i < height; i++) {
			a.push(row.slice(0));	// slice used to avoid array as reference type
		}
		return a;
	};

	// make world
	$scope.world = makeWorldArray(height, width);

	// ititiasize world
	for(var r = 0; r < height; r++) {
		for(var c = 0; c < width; c++) {
			$scope.world[r][c] = Math.random() > bound ? true : false;  
		}
	}
	
	
	// updateScope takes in a multidimensional array with equal size to world and updates
	// 		world to it
	// a [[]] - array to update world to
	var updateScope = function(a) {
		$scope.a = a;
	};


	// conwayGameRules takes in the (row, col) coordinate of a point within the bounds of
	//		$scope.world and outputs the new value of the point based on the rules 
	var conwayGameRules = function(row, col) {
		
		// calculate number of live neighbors for game rules
		var neighbors = 0;
		// loop over 3x3 block surrounding point (row, col)
		for(var r = row-1; r <= row+1; r++) {
			for(var c = col-1; c <= col+1; c++) {
				// check if point it valid (row, col) not counted
				if((r >= 0 && r < $scope.world.length) &&
					(c >= 0 && c < $scope.world[0].length) &&
					(r != row && c != col)) {
					// increase neighbors if neighbor is live
					if($scope.world[r][c] == true) {
						neighbors++;
					}
				}
			}
		}

		// implement game rules
		//Any live cell with fewer than two live neighbors dies
		if($scope.world[row][col] == true && neighbors < 2) {
			return false;
		}
		// Any live cell with two or three live neighbours lives on to the next generation
		else if($scope.world[row][col] == true && (neighbors == 2 || neighbors == 3)) {
			return true;
		}
		// Any live cell with more than three live neighbours dies
		else if($scope.world[row][col] == true && neighbors > 3) {
			return false;
		}
		// Any dead cell with exactly three live neighbours becomes a live cell
		else if($scope.world[row][col] == false && neighbors == 3) {
			return true;
		}
		else {
			return $scope.world[row][col];
		}
	};

	
	var updateWorld = function(gameRules) {
		// make temp world for simultaneous updating
		var tempWorld = makeWorldArray(height, width);

		// loop over world
		for(var r = 0; r < $scope.world.length; r++) {
			for(var c = 0; c < $scope.world[0].length; c++) {
				tempWorld[r][c] = gameRules(r, c);
			}
		}

		// update world
		$scope.world = tempWorld;
	};


	// repeatedly update world with gameRules function
	$interval(function(){ updateWorld(conwayGameRules); }, delay);
	
}]);