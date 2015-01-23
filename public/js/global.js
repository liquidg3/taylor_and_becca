(function (a, $, Svg, google) {

    var app = a.module('romiller', ['liquidfire']);

    app.controller('MainController', ['$scope', '$http', function ($scope, $http) {

        $scope.crestColors      = [
            '#e9405f',
            '#fb4d2b',
            '#ffad3d',
            '#008e74',
            '#94e7d5',
            '#000000'
        ];
        $scope.crestColorIndex  = 0;

        $scope.crest = new Svg('#crest');
        Svg.load('/public/images/crest.svg', function (data) {

            $scope.crest.append(data);
            $scope.crestPaths = $scope.crest.selectAll('path');
            $scope.animateCrest();

        });

        $scope.animateCrest = function () {

            var color = $scope.crestColors[$scope.crestColorIndex];

            $scope.crestColorIndex ++;

            if ($scope.crestColorIndex >= $scope.crestColors.length) {
                $scope.crestColorIndex = 0;
            }

            $scope.fillLogo(color, $scope.animateCrest.bind($scope));

        };

        $scope.fillLogo = function (color, cb) {

            var i = 1;
            for(var p  in $scope.crestPaths.items) {
                $scope.crestPaths[p].animate({fill: color}, 10000, undefined, i == $scope.crestPaths.items.length ? cb : undefined);
                i++;
            }

        };

        $scope.video = document.getElementById('hero-video');
        $scope.muted = true;
        $scope.video.addEventListener('canplay', function () {
        });

        $scope.toggleAudio = function () {

            if ($scope.muted) {
                $scope.muted        = false;
                $scope.video.muted  = false;
                $scope.video.controls = true;
                $scope.video.currentTime = 0;
                $scope.video.play();
            } else {
                $scope.muted        = true;
                $scope.video.muted  = true;
            }
        };


        $scope.showMap = function () {


            if (this.shownMap) {
                window.location = 'https://www.google.com/maps/place/The+Inn+at+Sunset+Cliffs/@32.736275,-117.255317,17z/data=!3m1!4b1!4m2!3m1!1s0x80deaa3290a1a941:0x950fb6ec71431051';
                return;
            }

            this.shownMap = true;
            var $map = $('#map');

            $map.height($map.height());

            $map.html('<iframe frameborder="0" style="border:0; pointer-events:none" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBWUxzOZJpPeUMkkqQXKuIkZZ5xR3IrdKU&q=Inn+at+Sunset+Cliffs"></iframe>');
        };

        $scope.songSuggestion = {
            name: '',
            suggestions: ''
        };
        $scope.resetMusicModal = function () {
            $scope.songSuggestion.name = '';
            $scope.songSuggestion.suggestions = '';
        };
        $scope.resetMusicModal();

        $scope.submitSongSuggestion = function () {


            $http.post('/song', {
                name: $scope.songSuggestion.name,
                suggestions: $scope.songSuggestion.suggestions
            }).success(function () {

                $('#music-modal').modal('hide');

            }).error(function () {
                alert('An error occurred, try again later.')
            });

        };



    }]);

    new WOW().init();



})(angular, jQuery, Snap, google);