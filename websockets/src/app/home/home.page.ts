import { Component } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Subject } from 'rxjs';
import { R3ExpressionFactoryMetadata } from '@angular/compiler/src/render3/r3_factory';
//import { observable } from 'rxjs';

const RaspiRadio_URL = "ws://teilchen.ddns.net:8765";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  private message = "Leere Variable";
  private mywebsocket;

  constructor(
    private wsService: WebsocketService
  ) {}

  ngOnInit() {
    this.mywebsocket = this.wsService.connect(RaspiRadio_URL);
    this.mywebsocket.subscribe(
      (next) => {
        this.message = next.data;
      }
    )


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

  private Play() {
    console.log("Play klicked");
    this.mywebsocket.next("Play");
  }

  private Pause() {
    console.log("Pause klicked");
    this.mywebsocket.next("Pause");
  }

  private Unpause() {
    console.log("Unpause klicked");
    this.mywebsocket.next("Unpause");
  }

  //private messages = new Array();
  //private positionx = "";
  //private positiony = "";


}
