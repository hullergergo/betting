var app = angular.module('myApp',['ngRoute']);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "starterpage.html"
    })
    .when("/betting", {
        templateUrl : "betting.html",
        controller : "BettingController"
    });
});

app.controller('BettingController', ['$scope', '$interval', function($scope, $interval) {
	var url = "http://localhost:3000";
	$scope.checkHomeTeam = "";
	$scope.checkAwayTeam = "";
	$scope.matchOdds = 0;
	$scope.matchResults = [];
	$scope.searchedMatchResult = {};
	$scope.avg = {};
	$scope.matchAvg = 0;
	$scope.resultOk = false;
	$scope.selectedFile = "";
	$scope.tableData = [];
	$scope.selected = false;
	$scope.selectedData = {};
	$scope.allMatchCB = 0;
    $scope.matchNumber = 0;
	$scope.homeAway = 0;
	$scope.teams = [
		{name: "Golden State Warriors", sname: "gol"},
		{name: "San Antonio Spurs", sname: "san"},
		{name: "Houston Rockets", sname: "hou"},
		{name: "Los Angeles Clippers", sname: "losc"},
		{name: "Utah Jazz", sname: "uta"},
		{name: "Memphis Grizzlies", sname: "mem"},
		{name: "Oklahoma City Thunder", sname: "okl"},
		{name: "Denver Nuggets", sname: "den"},
		{name: "Sacramento Kings", sname: "sac"},
		{name: "Portland Trail Blazers", sname: "por"},
		{name: "New Orleans Pelicans", sname: "newp"},
		{name: "Dallas Mavericks", sname: "dal"},
		{name: "Minnesota Timberwolves", sname: "min"},
		{name: "Los Angeles Lakers", sname: "losl"},
		{name: "Phoenix Suns", sname: "pho"},
		{name: "Cleveland Cavaliers", sname: "cle"},
		{name: "Boston Celtics", sname: "bos"},
		{name: "Washington Wizards", sname: "was"},
		{name: "Toronto Raptors", sname: "tor"},
		{name: "Atlanta Hawks", sname: "atl"},
		{name: "Indiana Pacers", sname: "ind"},
		{name: "Chicago Bulls", sname: "chi"},
		{name: "Detroit Pistons", sname: "det"},
		{name: "Milwaukee Bucks", sname: "mil"},
		{name: "Miami Heat", sname: "mia"},
		{name: "Charlotte Hornets", sname: "cha"},
		{name: "New York Knicks", sname: "newk"},
		{name: "Philadelphia 76ers", sname: "phi"},
		{name: "Orlando Magic", sname: "orl"},
		{name: "Brooklyn Nets", sname: "bro"}
	];
    
	function getResults() {
		url += "/data";
		var data = getData(url);
		var lines = data.split('\n');
		for(var i=0;i<lines.length;i++){
			var tmp = lines[i].split(/\s+/);
			var tmpMatch = {homeTeam: tmp[0], homeScore: tmp[1], awayTeam: tmp[2], awayScore: tmp[3]};
			$scope.matchResults.push(tmpMatch);
		}
		postData(url, "csoki");
		
	}
	
	$scope.checkGame = function () {
		var actHomeTeamScore = 0;
		var actHomeTeamGotScore = 0;
		var actHomeTeamPiece = 0;
		var maximum = 5;
		if ($scope.allMatchCB == true) {
			maximum = $scope.matchResults.length;
		}
		for(var i = 0; i < $scope.matchResults.length;i++) {
			if($scope.matchResults[i].homeTeam === $scope.checkHomeTeam && actHomeTeamPiece != maximum ) {
				actHomeTeamScore += parseInt($scope.matchResults[i].homeScore);
				actHomeTeamGotScore += parseInt($scope.matchResults[i].awayScore);
				actHomeTeamPiece++;
			} else if($scope.matchResults[i].awayTeam === $scope.checkHomeTeam && actHomeTeamPiece != maximum && $scope.homeAway == false) {
				actHomeTeamScore += parseInt($scope.matchResults[i].awayScore);
				actHomeTeamGotScore += parseInt($scope.matchResults[i].homeScore);
				actHomeTeamPiece++;
			}
		}
				
		var actAwayTeamScore = 0;
		var actAwayTeamGotScore = 0;
		var actAwayTeamPiece = 0;
		for(var i = 0; i < $scope.matchResults.length;i++) {
			if($scope.matchResults[i].homeTeam === $scope.checkAwayTeam && actAwayTeamPiece != maximum && $scope.homeAway == false) {
				actAwayTeamScore += parseInt($scope.matchResults[i].homeScore);
				actAwayTeamGotScore += parseInt($scope.matchResults[i].awayScore);
				actAwayTeamPiece++;
			} else if($scope.matchResults[i].awayTeam === $scope.checkAwayTeam && actAwayTeamPiece != maximum) {
				actAwayTeamScore += parseInt($scope.matchResults[i].awayScore);
				actAwayTeamGotScore += parseInt($scope.matchResults[i].homeScore);
				actAwayTeamPiece++;
			}
		}
		$scope.searchedMatchResult = {homeT: $scope.checkHomeTeam, homeS: actHomeTeamScore/actHomeTeamPiece, homeGS: actHomeTeamGotScore/actHomeTeamPiece, homeNumber: actHomeTeamPiece,
		awayT: $scope.checkAwayTeam, awayS: actAwayTeamScore/actAwayTeamPiece, awayGS: actAwayTeamGotScore/actAwayTeamPiece, awayNumber: actAwayTeamPiece};
		$scope.avg = {avgHome: ($scope.searchedMatchResult.homeS + $scope.searchedMatchResult.homeGS), avgAway: ($scope.searchedMatchResult.awayS + $scope.searchedMatchResult.awayGS)}
		$scope.matchAvg = ($scope.avg.avgHome + $scope.avg.avgAway)/2;
		$scope.resultOk = true;
		
		var tmptable = {show:false, index: $scope.matchNumber , homeTeam: $scope.searchedMatchResult.homeT, awayTeam: $scope.searchedMatchResult.awayT, avg: +(Math.round($scope.matchAvg + "e+2")  + "e-2"), odds: $scope.matchOdds, homeT: $scope.checkHomeTeam, homeS: actHomeTeamScore/actHomeTeamPiece, homeGS: actHomeTeamGotScore/actHomeTeamPiece, homeNumber: actHomeTeamPiece,
		awayT: $scope.checkAwayTeam, awayS: actAwayTeamScore/actAwayTeamPiece, awayGS: actAwayTeamGotScore/actAwayTeamPiece, awayNumber: actAwayTeamPiece};
		$scope.tableData.push(tmptable);
        
        $scope.matchNumber++;
        
	};
	
	$scope.selectMatch = function (data) {
       
        for(var i =0 ;i<$scope.tableData.length;i++ ){
           
         $scope.tableData[i].show = false; 
        }
        data.show= true;
		
		$scope.selectedData = data;
	}
    
    $scope.remove = function(matchindex) {
       for(var i =0 ;i<$scope.tableData.length;i++ ){
           if($scope.tableData[i].index == matchindex ){
               $scope.tableData.splice(i,1);
               $scope.matchNumber--;
               return;
           }
           
       }
    
    
    }
	
	getResults();
}]);

