import { Injectable, OnDestroy } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';

@Injectable()
export class MockStateService<T> implements OnDestroy {
    private src: T[] = [];

    private currentSrcIndex = -1;

    private shouldEmitNext = true;

    private srcSubject: Subject<T> = new ReplaySubject<T>(1);
    public get srcObservable(): Observable<T> {
        return this.srcSubject.asObservable();
    }

    public continue(licenseInfo: Partial<T>): void {
        if (this.shouldEmitNext && this.src && this.src.length) {
            this.currentSrcIndex++;
            if (this.currentSrcIndex < this.src.length) {
                this.emitCurrentSrcItem();
            }
        }
    }

    public back(): void {
        if (this.shouldEmitNext && this.src && this.src.length) {
            this.currentSrcIndex--;
            if (this.currentSrcIndex >= 0) {
                this.emitCurrentSrcItem();
            }
        }
    }

    public setSrcIndex(index: number): void {
        this.currentSrcIndex = index;
        this.emitCurrentSrcItem();
    }

    public setSrcIndexByValue(value: T): void {
        this.currentSrcIndex = this.src.indexOf(value);
        this.emitCurrentSrcItem();
    }

    public setSrc(src: T[]): void {
        this.src = src;
        this.currentSrcIndex = this.src && this.src.length ? 0 : -1;
        this.emitCurrentSrcItem();
    }

    public setShouldEmitNext(shouldEmitNext: boolean): void {
        this.shouldEmitNext = shouldEmitNext;
    }

    public emitCurrentSrcItem(): void {
        this.srcSubject.next(this.src[this.currentSrcIndex]);
    }

    ngOnDestroy(): void {
        this.srcSubject.complete();
    }
}
