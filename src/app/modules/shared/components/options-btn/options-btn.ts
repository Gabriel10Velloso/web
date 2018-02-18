import {Component, ElementRef, EventEmitter, OnDestroy, Output, Renderer2, ViewChild} from '@angular/core';
import {OptionBtnComponent} from '../option-btn/option-btn';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-options-btn',
  styleUrls: ['./options-btn.scss'],
  templateUrl: './options-btn.html'
})
export class OptionsBtnComponent implements OnDestroy {
  private _subscriptions: Subscription;
  public options: Array<OptionBtnComponent> = [];
  public optionsAreVisible: Boolean = false;
  @Output() openState = new EventEmitter();
  @ViewChild('optionsHolder') optionsHolder: ElementRef;
  @ViewChild('toggler') toggler: ElementRef;

  constructor(private el: ElementRef, private renderer2: Renderer2) {
    this._subscriptions = new Subscription();
  }

  private getScrollOffset(): number {
    const scrollViewContainer = document.querySelector('app-scroll-view');
    if (scrollViewContainer) {
      return scrollViewContainer.scrollTop;
    } else {
      return document.scrollingElement.scrollTop;
    }
  }

  private registerCloseListeners() {
    let scrollSubscription: Subscription;
    let clickSubscription: Subscription;
    let contextmenuSubscription: Subscription;
    const close = (ev: MouseEvent) => {
      if (!this.toggler.nativeElement.contains(ev.target)) {
        this.close();
      }
      this._subscriptions.remove(scrollSubscription);
      this._subscriptions.remove(clickSubscription);
      this._subscriptions.remove(contextmenuSubscription);
    };
    scrollSubscription = this._subscriptions.add(
      this.renderer2.listen(document, 'scroll', close)
    );
    clickSubscription = this._subscriptions.add(
      this.renderer2.listen(document, 'click', close)
    );
    contextmenuSubscription = this._subscriptions.add(
      this.renderer2.listen(document, 'contextmenu', close)
    );
  }

  public open(): void {
    this.registerCloseListeners();
    this.optionsHolder.nativeElement.style.left = `${this.el.nativeElement.offsetLeft}px`;
    this.optionsHolder.nativeElement.style.top = `${this.el.nativeElement.getBoundingClientRect().top}px`;
    this.optionsAreVisible = true;
    this.openState.emit(true);
  }

  public close(): void {
    this.optionsAreVisible = false;
    this.openState.emit(false);
  }

  public toggleOpen(): void {
    if (this.optionsAreVisible) {
      this.close();
    } else {
      this.open();
    }
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }
}
