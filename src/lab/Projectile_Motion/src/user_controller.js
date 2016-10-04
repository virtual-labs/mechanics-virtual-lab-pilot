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
        self.selected     = null;
        self.users        = [ ];
        self.toggleList   = toggleUsersList;

        $scope.showVariables = false; /** I hides the 'Variables' tab */
        $scope.isActive = true;
        $scope.isActive1 = true; 

        $scope.hide_show_result=false; /** It hides the show result check box */ 
        $scope.control_disable = false;
        $scope.fire_disable = false;
        $scope.erase_disable = true;
		$scope.time_of_flight = 0;
        $scope.max_height = 0;
        $scope.horizontal_range = 0;
        
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
            type=$scope.Enviornment;
            enviornmentChange($scope); /** Function defined in experiment.js file */			
        }

        /** Function for changing the slider velocity */
        $scope.velocityFn = function() {
            velocitySliderChange($scope); /** Function defined in experiment.js file */
        }

        /** Function for changing the slider angle of projectile motion */
        $scope.angleOfProjection = function() {
            angleOfProjectionChange($scope); /** Function defined in experiment.js file */
        }

        /** Function for changing the slider cannon height */
        $scope.cannonHeight = function() {
            cannonHeightChange($scope); /** Function defined in experiment.js file */
        }

        /** Function for the button fire */
        $scope.fireFn = function() {
            fireButtonEvent($scope); /** Function defined in experiment.js file */
        }

        /** Function for erase the motion */
        $scope.eraseFn = function() {
            eraseButtonEvent($scope); /** Function defined in experiment.js file */
        }

        /** Function for showing the result */
        $scope.showResult = function() {
            showResultFN($scope); /** Function defined in experiment.js file */
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