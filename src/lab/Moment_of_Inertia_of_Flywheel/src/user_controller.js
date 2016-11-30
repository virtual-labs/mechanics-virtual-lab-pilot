var temp_scope;
(function(){
    angular
    .module('users',['FBAngular'])
    .controller('UserController', [
        '$mdSidenav', '$mdBottomSheet', '$log', '$q','$scope','$element','Fullscreen','$mdToast','$animate',
        UserController
    ]);
	   
    /**
    * Main Controller for the Angular Material Starter App
    * @param $scope
    * @param $mdSidenav
    * @param avatarsService
    * @constructor
    */
    function UserController( $mdSidenav, $mdBottomSheet, $log, $q,$scope,$element,Fullscreen,$mdToast, $animate) {
	    temp_scope = $scope;
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
            .filter(function(pos) { return $scope.toastPosition[pos]; })
            .join(' ');
        };
        $scope.showActionToast = function() {        
            var toast = $mdToast.simple()
            .content(helpArray[2])
            .action(helpArray[0])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
        
            var toast1 = $mdToast.simple()
            .content(helpArray[3])
            .action(helpArray[0])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
		  
            var toast2 = $mdToast.simple()
            .content(helpArray[4])
            .action(helpArray[0])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
            
            var toast3 = $mdToast.simple()
            .content(helpArray[5])
            .action(helpArray[0])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
            
            var toast4 = $mdToast.simple()
            .content(helpArray[6])
            .action(helpArray[1])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
            
            $mdToast.show(toast).then(function() {
                $mdToast.show(toast1).then(function() {
                    $mdToast.show(toast2).then(function() {
                        $mdToast.show(toast3).then(function() {
                            $mdToast.show(toast4).then(function() {
        
                            });        
                        });
			  		});
			  	});
            });
            		
        };
  
        var self = this;
        self.selected     = null;
        self.users        = [ ];
        self.toggleList   = toggleUsersList;

        $scope.showValue = true; /** It hides the 'Result' tab */
        $scope.showVariables = false; /** I hides the 'Variables' tab */
        $scope.isActive = true;
        $scope.isActive1 = true;      
		
        $scope.goFullscreen = function () {
            /** Full screen */
            if (Fullscreen.isEnabled())
                Fullscreen.cancel();
            else
                Fullscreen.all();
            /** Set Full screen to a specific element (bad practice) */
            /** Full screen.enable( document.getElementById('img') ) */
        };
        
        $scope.toggle = function () {
            $scope.showValue=!$scope.showValue;
            $scope.isActive = !$scope.isActive;
        };
	
        $scope.toggle1 = function () {
            $scope.showVariables=!$scope.showVariables;
            $scope.isActive1 = !$scope.isActive1;
        };

        /** Function for changing the drop down list */
        $scope.changeEnviornment = function() {
            g = $scope.Enviornment;
        }

        /** Function for changing the slider mass of flywheel */
        $scope.massOfWheel = function() {
            mass_of_flywheel = $scope.mass_of_fly_wheel;
        }

        /** Function for changing the slider diameter of flywheel */
        $scope.diameterOfWheel = function() {
            diameter_of_flywheel = $scope.dia_of_fly_wheel;
        }

        /** Function for the slider mass of rings */
        $scope.massOfRings = function() {
            mass_of_rings = $scope.mass_of_rings;
            massOfRingsChange($scope); /** Function defined in experiment.js file */
        }

        /** Function for the slider diameter of axle */
        $scope.diameterOfAxle = function() {
            diameter_of_axle = $scope.axle_diameter;
        }
        
        /** Function for the slider no of wounds of chord */
        $scope.noOfWounds = function() {
            no_of_wound = $scope.no_of_wound;
            noOfWoundsChange($scope); /** Function defined in experiment.js file */
        }

        /** Function for the button release/hold wheel */
        $scope.releaseHoldWheel = function() {
            releaseHold($scope); /** Function defined in experiment.js file */
        }

        /** Function for resetting the experiment */
        $scope.resetExp = function() {
            resetExperiment($scope); /** Function defined in experiment.js file */
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