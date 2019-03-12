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
    var data = JSON.stringify({"Component": "setVolume","newVolume": this.newVolume});
    //console.log(`Sent: ${data}`);
    this.mywebsocket.next(data);
  }
  private Play() {
    var data = JSON.stringify({"Component": "Play"});
    //console.log(`Sent: ${data}`);
    this.mywebsocket.next(data);
  }
  private Pause(status) {
    var data = JSON.stringify({"Component": "Pause","PauseStatus": status});
    //console.log(`Sent: ${data}`);
    this.mywebsocket.next(data);
  }
  private Stop() {
    var data = JSON.stringify({"Component": "Stop"});
    //console.log(`Sent: ${data}`);
    this.mywebsocket.next(data);
  }

}
