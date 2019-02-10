import { Component } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
//import { observable } from 'rxjs';

const RaspiRadio_URL = "ws://teilchen.ddns.net:8765";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  private message = "";

  constructor(
    private wsService: WebsocketService
  ) {
    wsService.connect(RaspiRadio_URL);
    
  }

  ngOnInit() {
    /*
    this.websocketService.observable.subscribe(
      (x: any) => this.messages.push(x),
      (error: any) => this.messages.push(error),
      () => this.messages.push('Completed')
    );
    
      this.websocketService.observable.subscribe(
        (x: any) => {
          this.positionx = x.x
          this.positiony = x.y
        }
      )
      */
  }

  //private messages = new Array();
  //private positionx = "";
  //private positiony = "";


}
