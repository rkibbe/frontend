import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  navigateAwaySelection$: Subject<boolean> = new Subject<boolean>();
  constructor() { }
}
