import { Injectable } from '@angular/core';
import * as Rx from 'rxjs';
import { Observable, Observer } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor() { }

  /*
    Observables/Observer/Subscriber werden für Aktionen verwendet, die Asynchron laufen sollen,
    weil zB die Daten, die abgefragt werden sollen nicht sofort zur Verfügung stehen. (Bei einer Abfrage von
    einem HTTP-Server zB. kann es passieren, dass der Server die Antwort noch nicht gesendet hat, aber die GUI
    die (noch) leere Ergebnis-Variable bereits anzeigt) Das kann zu Fehlern führen.

    Observable - beinhaltet das Objekt das beobachtet werden soll
    Observer - ist der asynchrone Service, der das Observable beobachtet
    Subscriber - ist der GUI-Teil, der sich bei einem Observer anmeldet, weil er ein "Abonnent" der Daten sein möchte.

    Im einfachsten Beispiel kann zB. ein Observable ein Event wie zB "mousemoved" sein.
    Der Observer beobachtet das observable. Und wenn es einen Subscriber gibt, wird an diesen bei Änderung des Observables
    eine Nachricht geschickt (emit). Wenn der Observable ein MouseMoved Event ist, wird dieser Event dem Subscriber gesendet
    sobald er auftritt. Aus dem Event kann dann die Mausposition ausgelesen werden und somit auch im Template angezeigt werden.

    https://coursetro.com/posts/code/148/RxJS-Observables-Tutorial---Creating-&-Subscribing-to-Observables
    https://angular.io/guide/observables
    https://rxjs-dev.firebaseapp.com/
    https://medium.com/@zmharker/rxjs-observables-in-ionic-and-angular-apps-a-beginners-guide-181643af675e
    https://medium.com/@luukgruijs/understanding-creating-and-subscribing-to-observables-in-angular-426dbf0b04a3
    https://angular.de/artikel/angular2-observables/

    Eine spezielle Art stellt ein "Subject" dar. Es ist gleichzeitig ein Observer sowie ein Observable.
    Somit kann man es als ein Event-Emitter gesehen werden, der gleich mehrere Subscriber bedienen kann.
    Wenn man beispielsweise mehrere Komponenten hat, die gleichzeitig auf die Nachrichten eines Websocket-Servers hören sollen
    ist ein "Subject" ideal. Gerade bei einem Websocket-Dienst trifft das nochmal im speziellen zu.
    
    https://blog.angulartraining.com/rxjs-subjects-a-tutorial-4dcce0e9637f
  */

  //Das Subject ist vom Typ MessageEvent, welches mit dem WebSocket Interface & onMessage zu tun hat
  //https://developer.mozilla.org/de/docs/Web/API/MessageEvent
  private subject: Rx.Subject<MessageEvent>;

  //Diese Funktion ist von außen sichtbar. Es stellt nur den Zugriff auf die privaten Elemente
  //der Klasse zur Verfügung.
  //Die Funktion "create(url)" ist die Private Funktion die die Verbindung zum Websocket-Server aufbaut und
  //das "Subject" zusammenbaut, welches aus Observer & Observable besteht. Am Ende wird der aufrufenden Komponente
  //das Subject als Rückgabewert geliefert. Diese kann dann über das Subject "subscriben" sowie Nachrichten emittieren.
  //(Über websockets senden & empfangen)
  public connect(url): Rx.Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
      console.log("Successfully connected: " + url);
    }
    return this.subject;
  }

  //Diese Funktion generiert zuerst ein Observable und dann einen Observer. Am Ende werden beide im "Subject" kombiniert
  //und an die Funktion "connect" zurückgegeben.
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
      next: (data: string) => {   //Funktion "Next" welches ein Datenobjekt in Form eines Strings als Übergabewert nimmt.
        if (ws.readyState === WebSocket.OPEN) {   //Wenn der Websocket verbunden ist
          ws.send(data);    //sende den String über Websocket
          console.log(`WS sent: ${data}`);
        }
      }
    }
  
    //Baut schlussendlich das Subject aus observable und observer zusammen und "returned" es an die Connect-Funktion die es
    //wiederum an die Aufrufende KOmponente übergibt. Diese kann dann "subscriben" und damit auf neue Nachrichten lauschen
    //genauso wie per "Next" neue Nachrichten senden.
    return Rx.Subject.create(observer, observable);
  }
}
