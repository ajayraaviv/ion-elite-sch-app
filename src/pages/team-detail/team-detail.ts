import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EliteApi } from '../../providers/elite-api/elite-api';
import * as _ from 'lodash';
import { GamePage } from '../game/game';
import moment from 'moment';

@Component({
  selector: 'page-team-detail',
  templateUrl: 'team-detail.html',
})
export class TeamDetailPage {
  private allGames: any[];
  public dateFilter: string;
  public team: any = {};
  public teamStanding: any = {};
  public games: any[];
  private tourneyData: any;
  constructor(public navCtrl: NavController
    , public navParams: NavParams
    , private eliteApi: EliteApi) {
    
  }

  ionViewDidLoad() {
    this.team = this.navParams.data;
    
    this.tourneyData = this.eliteApi.getCurrentTourney();
    this.games = _.chain(this.tourneyData.games)
                  .filter(g => g.team1Id === this.team.id || g.team2Id === this.team.id)
                  .map(g => {
                    let isTeam1 = (g.team1Id === this.team.id);
                    let opponentName = isTeam1 ? g.team2 : g.team1;
                    let scoreDisplay = this.getScoreDisplay(isTeam1, g.team1Score, g.team2Score);
                    return {
                      gameId: g.id,
                      opponent: opponentName,
                      time: Date.parse(g.time),
                      location: g.location,
                      locationUrl: g.locationUrl,
                      scoreDisplay: scoreDisplay,
                      homeAway: (isTeam1? "vs." : ".at")

                    };
                  })
                  .value();
    this.allGames = this.games;
    this.teamStanding = _.find(this.tourneyData.standings, { 'teamId': this.team.id});
  }

  dateChanges() {
    this.games = _.filter(this.allGames, g => moment(g.time).isSame(this.dateFilter, 'day'));
  }

  getScoreDisplay(isTeam1, team1Score, team2Score) {
    if(team1Score && team2Score) {
      let teamScore = (isTeam1) ? team1Score : team2Score;
      let opponentScore = (isTeam1) ? team2Score : team1Score;
      let winIndicator = teamScore > opponentScore ? "W. " : "L. ";
      return winIndicator + teamScore + " - " + opponentScore;
    } else {
      return "";
    }

  }

  gameClicked($event, game) {
    let sourceGame = this.tourneyData.games.find(g => g.id === game.gameId);
    this.navCtrl.parent.parent.push(GamePage, sourceGame);
  }

  // goHome() {
  //   this.navCtrl.parent.parent.popToRoot();
  // }
}
