import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';

const RaspiRadio_URL = "ws://teilchen.ddns.net:8765";

@Component({
  selector: 'app-json',
  templateUrl: './json.page.html',
  styleUrls: ['./json.page.scss'],
})
export class JsonPage implements OnInit {

  private mywebsocket;
  private newVolume = 20;

  constructor(
    private wsService: WebsocketService
  ) { }

  ngOnInit() {
    this.mywebsocket = this.wsService.connect(RaspiRadio_URL);
    /*
    this.mywebsocket.subscribe(
      (next) => {
        this.message = next.data;
      }
    )
    */
  }

  private setVolume() {
    var data = JSON.stringify({"Component": "newVolume","newVolume": this.newVolume});
    //console.log(`Sent: ${data}`);
    this.mywebsocket.next(data);
  }

}
