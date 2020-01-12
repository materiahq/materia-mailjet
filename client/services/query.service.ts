import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  constructor(private http: HttpClient) { }

  /**
   * @description
   * Run a query using Materia Server admin API
   * @param baseUrl: server base url
   * @param entity: name of the query's entity
   * @param query: name of the query
   * @param params: optional query parameters
   */
  run(baseUrl: string, entity: string, query: string, params?: any): Observable<any> {
    return this.http
      .post(`${baseUrl}/entities/${entity}/queries/${query}`, params);
  }
}
