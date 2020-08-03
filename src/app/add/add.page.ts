import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { MediaService } from '../media.service';
import Keyboard from 'simple-keyboard';

@Component({
  selector: 'app-add',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './add.page.html',
  styleUrls: [
    './add.page.scss',
    '../../../node_modules/simple-keyboard/build/css/index.css'
  ],
})
export class AddPage implements OnInit, AfterViewInit {

  source = 'spotify';

  keyboard: Keyboard;
  value = '';
  selectedInputElem: any;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.keyboard = new Keyboard({
      onChange: input => {
        this.selectedInputElem.value = input;
      },
      onKeyPress: button => {
        if (button === '{shift}' || button === '{lock}') {
          this.handleShift();
        }
      }
    });

    this.selectedInputElem = document.querySelector('ion-input:first-child');
  }

  focusChanged(event: any) {
    this.selectedInputElem = event.target;

    this.keyboard.setOptions({
      inputName: event.target.name
    });
  }

  inputChanged(event: any) {
    this.keyboard.setInput(event.target.value, event.target.name);
  }

  handleShift() {
    const currentLayout = this.keyboard.options.layoutName;
    const shiftToggle = currentLayout === 'default' ? 'shift' : 'default';

    this.keyboard.setOptions({
      layoutName: shiftToggle
    });
  }

  segmentChanged(event: any) {
    this.source = event.detail.value;
  }

  submit(form) {

  }

}
