(function() {
	angular.module('users', ['FBAngular'])
		.controller('UserController', [
		'$mdSidenav', '$mdBottomSheet', '$log', '$q', '$scope', '$element', 'Fullscreen', '$mdToast', '$animate',
	UserController]);

	/**
	 * Main Controller for the Angular Material Starter App
	 * @param $scope
	 * @param $mdSidenav
	 * @param avatarsService
	 * @constructor
	 */
	function UserController($mdSidenav, $mdBottomSheet, $log, $q, $scope, $element, Fullscreen, $mdToast, $animate) {
		$scope.toastPosition = {
			bottom: true,
			top: false,
			left: true,
			right: false
		};
		$scope.toggleSidenav = function(ev) {
			$mdSidenav('right').toggle();
		};
		$scope.getToastPosition = function() {
			return Object.keys($scope.toastPosition)
				.filter(function(pos) {
				return $scope.toastPosition[pos];
			})
				.join(' ');
		};
		$scope.showActionToast = function() {
			var toast = $mdToast.simple()
				.content(help_array[0])
				.action(help_array[7])
				.hideDelay(15000)
				.highlightAction(false)
				.position($scope.getToastPosition());

			var toast1 = $mdToast.simple()
				.content(help_array[1])
				.action(help_array[7])
				.hideDelay(15000)
				.highlightAction(false)
				.position($scope.getToastPosition());

			var toast2 = $mdToast.simple()
				.content(help_array[2])
				.action(help_array[7])
				.hideDelay(15000)
				.highlightAction(false)
				.position($scope.getToastPosition());

			var toast3 = $mdToast.simple()
				.content(help_array[3])
				.action(help_array[7])
				.hideDelay(15000)
				.highlightAction(false)
				.position($scope.getToastPosition());

			var toast4 = $mdToast.simple()
				.content(help_array[4])
				.action(help_array[7])
				.hideDelay(15000)
				.highlightAction(false)
				.position($scope.getToastPosition());
			
			var toast5 = $mdToast.simple()
				.content(help_array[5])
				.action(help_array[7])
				.hideDelay(15000)
				.highlightAction(false)
				.position($scope.getToastPosition());
			
			var toast6 = $mdToast.simple()
				.content(help_array[6])
				.action(help_array[8])
				.hideDelay(15000)
				.highlightAction(false)
				.position($scope.getToastPosition());

			$mdToast.show(toast).then(function() {
				$mdToast.show(toast1).then(function() {
					$mdToast.show(toast2).then(function() {
						$mdToast.show(toast3).then(function() {
							$mdToast.show(toast4).then(function() {
								$mdToast.show(toast5).then(function() {
									$mdToast.show(toast6).then(function() {
								
									});
								});
							});
						});
					});
				});
			});
		};

		var self = this;
		self.selected = null;
		self.users = [];
		self.toggleList = toggleUsersList;
		$scope.showValue = false; /** It hides the 'Result' tab */
		$scope.showObjectA = false;
		$scope.showVariables = false; /** I hides the 'Variables' tab */
		$scope.isActive = true;
		$scope.isActive1 = true;
		$scope.radio_disable =false;
		$scope.substance_disable = false; /** It disables the Select substance dropdown */
		$scope.controls_disable = false;
		$scope.showObjectB=true;
		$scope.coeff_restitution = 0; 
		$scope.velocity1_val=20;
		$scope.mass1_val=1;
		$scope.mass2_val=1;
		$scope.velocity2_val=0;

		$scope.temperature = 0 + "℃"; /** Initial temperature slider value */
		$scope.minTemperature = 0;
		$scope.maxTemperature = 100;
		$scope.hide_show_result = false;
		$scope.show_menu = false;

		$scope.goFullscreen = function() {
			/** Full screen */
			if (Fullscreen.isEnabled()) Fullscreen.cancel();
			else Fullscreen.all();
			/** Set Full screen to a specific element (bad practice) */
			/** Full screen.enable( document.getElementById('img') ) */
		};

		$scope.toggle = function() {
			$scope.showValue = !$scope.showValue;
			$scope.isActive = !$scope.isActive;
			//if ($scope.resultValue == true) $scope.hide_show_result = !$scope.hide_show_result;
		};

		$scope.toggle1 = function() {
			$scope.showVariables = !$scope.showVariables;
			$scope.isActive1 = !$scope.isActive1;
		};
		/** Function for choosing the drop down list */
		$scope.selectTypeFn = function() {
			selectTypeFn($scope);
		}
		/** Change event function of Mass slider */
		$scope.massSlider = function() {
			$scope.mass = $scope.Mass;
			massSliderFN($scope); /** Function defined in experiment.js file */
		}
		/** Change event function of Temperature slider */
		$scope.tempSlider = function() {
			if ($scope.Substance == "naphthalene") {
				temperature_float = $scope.Temperature_one;
			} else if ($scope.Substance == "ice") {
				temperature_float = $scope.Temperature_two;
			} else {
				temperature_float = $scope.Temperature_three;
			}
			temperatureSliderFN($scope); /** Function defined in experiment.js file */
		}
		/** Click event function of start experiment button */
		$scope.startExp = function() {
			startExperiment($scope); /** Function defined in experiment.js file */
		}
		$scope.resetExp = function() {
			resetFn($scope); /** Function defined in experiment.js file */
		}
		$scope.temp = {
            data : 'obj1'
        }
        
		$scope.result_Check = function() {
            resultCheck($scope); /** Function defined in experiment.js file */
        }
		
		/** Change event function of the check box Show result */
		$scope.showResult = function() {
			showresultFN($scope); /** Function defined in experiment.js file */
		}
		/**
		 * First hide the bottom sheet IF visible, then
		 * hide or Show the 'left' sideNav area
		 */
		function toggleUsersList() {
			$mdSidenav('right').toggle();
		}
	}
})();