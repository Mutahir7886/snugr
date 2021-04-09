import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable({
      providedIn: 'root'
})
export class HttpService {

      public headers = new HttpHeaders({
            'Content-Type': 'application/json'
      });

      constructor(private http: HttpClient) {
      }

      get(path, headers = this.headers): Observable<any> {
            return this.http.get(path, {headers});
      }

      getWithParams(path,params, headers = this.headers): Observable<any> {
            return this.http.get(path, {headers,params});
      }

      post(path, data, headers = this.headers): Observable<any> {
          console.log(path)
            return this.http.post<any>(path, data, {headers});
      }
    postWithProgress(path, data, headers = this.headers): Observable<any> {
        return this.http.post<any>(path, data, {headers, observe: 'events', reportProgress: true, responseType: 'json'});
    }
  put(path, data, headers = this.headers): Observable<any> {
    return this.http.put(path, data, {headers});
  }

      delete(path) {
            return this.http.delete(path);
      }
  patch(path, data, headers = this.headers): Observable<any> {
    return this.http.patch(path, data, {headers});
  }
}
