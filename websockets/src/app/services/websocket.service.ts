import { Injectable } from '@angular/core';
import * as Rx from 'rxjs';
import { Observable, Observer } from "rxjs";
import { fromEvent } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor() { }

  //Erzeugt ein RxJS Subject das gleichzeitig ein Observer und ein Observable ist.
  //Der 2. Vorteil ist, dass damit mehrere Subscriptions möglich sind. zB von mehreren Komponenten gleichzeitig
  //Das Subject ist vom Typ MessageEvent, welches mit dem WebSocket Interface & onMessage zu tun hat
  //https://blog.angulartraining.com/rxjs-subjects-a-tutorial-4dcce0e9637f
  //https://developer.mozilla.org/de/docs/Web/API/MessageEvent
  private subject: Rx.Subject<MessageEvent>;

  //Diese Funktion ist von außen sichtbar. Es stellt nur den Zugriff auf die privaten Elemente
  //der Klasse zur Verfügung. Der Rückgabewert ist vom Typ "Subject-MessageEvent" weil der Rückgabewert
  //der Funktion in die Variable "Subject" von oben hineingeschrieben wird.
  //Die Funktion "create(url)" ist die Private Funktion die die Verbindung zum Websocket-Server aufbaut und
  //die Events des Websocket-Servers mit den Observable-Events verknüpft.
  //Am Ende ist der Rückgabewert, die die aufrufende Komponente bekommt ein fertiger Observer
  //den man dann subscriben kann.
  public connect(url): Rx.Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
      console.log("Successfully connected: " + url);
    }
    return this.subject;
  }

  //Diese Funktion hat als Rückgabewert wiederum ein "Subject-MessageEvent", weil es so von der connect-Funktion
  //benötigt wird.
  private create(url): Rx.Subject<MessageEvent> {
    let ws = new WebSocket(url);  //Der WebSocket selbst wird angelegt
    
    //Anlegen des Observables für das "Subject" und binden der Events des Websockets mit denen des Observables.
    let observable = Observable.create(
      (obs: Observer<MessageEvent>) => {  //neue Variable "obs" vom Typ Observer<MessageEvent>
        ws.onmessage = obs.next.bind(obs);
        ws.onerror = obs.error.bind(obs);
        ws.onclose = obs.complete.bind(obs);
        return ws.close.bind(ws);
      }
    )

    //Deklariert die observer-Komponente für das "Subject" und sorgt dafür dass per next auch Daten emitted werden können.
    let observer = {
      next: (data: Object) => {   //Funktion "Next" welches ein Datenobjekt in Form eines JSON-Objektes als Übergabewert nimmt.
        if (ws.readyState === WebSocket.OPEN) {   //Wenn der Websocket verbunden ist
          ws.send(JSON.stringify(data));    //konvertiere das JSON-Objekt in einen String, da Websockets nur Strings übertragen kann.
        }
      }
    }
    
    //Baut schlussendlich das Subject aus observable und observer zusammen und "returned" es an die Connect-Funktion die es
    //wiederum an die Aufrufende KOmponente übergibt. Diese kann dann "subscriben" und damit auf neue Nachrichten lauschen
    //genauso wie per "Next" neue Nachrichten senden.
    return Rx.Subject.create(observer, observable);
  }


  //public observable = fromEvent(document, 'mousemove')
  /*
  public observable = Observable.create((observer: any) => {
    try {
      observer.next('I am the Observable.')
      observer.next('And who are you?')
      observer.complete()
      observer.next('Not sending this...')
    }
    catch (err) {
      observer.error(err)
    }
  })
  */
}
