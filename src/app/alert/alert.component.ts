import { Component ,Injectable, OnInit, OnDestroy, Input  } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject, Subscription  } from 'rxjs';
import { filter } from 'rxjs/operators';

export class Alert {
  type: AlertType;
  message: string;
  alertId: string;
  keepAfterRouteChange: boolean;

  constructor(init?:Partial<Alert>) {
      Object.assign(this, init);
  }
}

export enum AlertType {
  Success,
  Error,
  Info,
  Warning
}

@Injectable({ providedIn: 'root' })
export class AlertService {
    private subject = new Subject<Alert>();
    private keepAfterRouteChange = false;

    constructor(private router: Router) {
        // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterRouteChange) {
                    // only keep for a single route change
                    this.keepAfterRouteChange = false;
                } else {
                    // clear alert messages
                    this.clear();
                }
            }
        });
    }

    // enable subscribing to alerts observable
    onAlert(alertId?: string): Observable<Alert> {
        return this.subject.asObservable().pipe(filter(x => x && x.alertId === alertId));
    }

    // convenience methods
    success(message: string, alertId?: string) {
        this.alert(new Alert({ message, type: AlertType.Success, alertId }));
    }

    error(message: string, alertId?: string) {
        this.alert(new Alert({ message, type: AlertType.Error, alertId }));
    }

    info(message: string, alertId?: string) {
        this.alert(new Alert({ message, type: AlertType.Info, alertId }));
    }

    warn(message: string, alertId?: string) {
        this.alert(new Alert({ message, type: AlertType.Warning, alertId }));
    }

    // main alert method    
    alert(alert: Alert) {
        this.keepAfterRouteChange = alert.keepAfterRouteChange;
        this.subject.next(alert);
    }

    // clear alerts
    clear(alertId?: string) {
        this.subject.next(new Alert({ alertId }));
    }
}


@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent  implements  OnInit, OnDestroy {

  @Input() id: string;

    alerts: Alert[] = [];
    subscription: Subscription;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.subscription = this.alertService.onAlert(this.id)
            .subscribe(alert => {
                if (!alert.message) {
                    // clear alerts when an empty alert is received
                    this.alerts = [];
                    return;
                }

                // add alert to array
                this.alerts.push(alert);
            });
    }

    ngOnDestroy() {
        // unsubscribe to avoid memory leaks
        this.subscription.unsubscribe();
    }

    removeAlert(alert: Alert) {
        // remove specified alert from array
        this.alerts = this.alerts.filter(x => x !== alert);
    }

    cssClass(alert: Alert) {
        if (!alert) {
            return;
        }

        // return css class based on alert type
        switch (alert.type) {
            case AlertType.Success:
                return 'alert alert-success';
            case AlertType.Error:
                return 'alert alert-danger';
            case AlertType.Info:
                return 'alert alert-info';
            case AlertType.Warning:
                return 'alert alert-warning';
        }
    }


}
