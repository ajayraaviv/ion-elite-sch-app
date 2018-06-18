import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { TournamentsPage } from '../tournaments/tournaments';
import { TeamHomePage } from '../team-home/team-home';
import { EliteApi } from '../../providers/elite-api/elite-api';

@Component({
    selector: 'page-my-teams',
    templateUrl: 'my-teams.html'
})

export class MyTeamsPage {
    public favorites: any[];
    constructor(private nav: NavController
        , private loadingController: LoadingController
        , private eliteApi: EliteApi) {
        
    }

    goToTournaments() {
        this.nav.push(TournamentsPage);
    }

    favoriteTapped($event, favorite) {
        let loader = this.loadingController.create({
            content: 'Getting data...',
            dismissOnPageChange: true

        });
        loader.present();
        this.eliteApi.getTournamentData(favorite.tournamentId)
            .subscribe(t => this.nav.push(TeamHomePage, favorite.team));
    }

}