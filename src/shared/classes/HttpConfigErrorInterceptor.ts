import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {Router} from '@angular/router';
import {globalToast} from "./globalToast";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(public router: Router,
              private globalToast:globalToast) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      console.log('error in query interce', err)
      if(err.status===0)
      {
        this.globalToast.presentToast('Internet Connection Error')
      }
       else if(err.status===500)
       {
            this.globalToast.presentToast('Internal Server Error')
        }
     else {
        this.globalToast.presentToast(err.error)


      }



      if (err.error.data) {
        console.log('checking err data', err.error.data);
        return throwError(err);
      }
      const e = err.error.message || err.statusText;
      return throwError(e);
    }));
  }
}
