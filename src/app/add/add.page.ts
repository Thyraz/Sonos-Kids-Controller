import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild, NgModule } from '@angular/core';
import { MediaService } from '../media.service';
import { Media } from '../media';
import Keyboard from 'simple-keyboard';
import { NgForm, FormsModule,ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [ReactiveFormsModule, FormsModule]
})

@Component({
  selector: 'app-add',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './add.page.html',
  styleUrls: [
    './add.page.scss',
    '../../../node_modules/simple-keyboard/build/css/index.css'
  ]
})
export class AddPage implements OnInit, AfterViewInit {

  source = 'spotify';
  keyboard: Keyboard;
  selectedInputElem: any;
  valid = false;

  constructor(
    private mediaService: MediaService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.keyboard = new Keyboard({
      onChange: input => {
        this.selectedInputElem.value = input;
        this.validate();
      },
      onKeyPress: button => {
        this.handleLayoutChange(button);
      },
      theme: 'hg-theme-default hg-theme-ios',
      layout: {
        default: [
          'q w e r t z u i o p ü',
          'a s d f g h j k l ö ä',
          '{shift} y x c v b n m {shift}',
          '{alt} {space} . {bksp}'
        ],
        shift: [
          'Q W E R T Z U I O P Ü',
          'A S D F G H J K L Ö Ä',
          '{shiftactivated} Y X C V B N M {shift}',
          '{alt} {space} . {bksp}'
        ],
        alt: [
          '1 2 3 4 5 6 7 8 9 0 =',
          `% @ # $ & * / ( ) ' "`,
          '{shift} , - + ; : ! ? {shift}',
          '{default} {space} . {bksp}'
        ]
      },
      display: {
        '{alt}': '123',
        '{smileys}': '\uD83D\uDE03',
        '{shift}': '⇧',
        '{shiftactivated}': '⇧',
        '{enter}': '⮐ ',
        '{bksp}': '⌫',
        '{altright}': '123',
        '{downkeyboard}': '🞃',
        '{space}': ' ',
        '{default}': 'ABC',
        '{back}': '⇦'
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
    this.validate();
  }

  handleLayoutChange(button) {
    const currentLayout = this.keyboard.options.layoutName;
    let layout: string;

    switch (button) {
      case '{shift}':
      case '{shiftactivated}':
      case '{default}':
        layout = currentLayout === 'default' ? 'shift' : 'default';
        break;
      case '{alt}':
      case '{altright}':
        layout = currentLayout === 'alt' ? 'default' : 'alt';
        break;
      case '{smileys}':
        layout = currentLayout === 'smileys' ? 'default' : 'smileys';
        break;
      default:
        break;
    }

    if (layout) {
      this.keyboard.setOptions({
        layoutName: layout
      });
    }
  }

  segmentChanged(event: any) {
    this.source = event.detail.value;
  }

  submit(form: NgForm, type: string) {
    let media: Media = {
      type
    };

    if (type === 'spotify') {
      if (form.form.value.artist?.length) media['artist'] = form.form.value.artist;
      if (form.form.value.title?.length) media['title'] = form.form.value.title;
      if (form.form.value.query?.length) media['query'] = form.form.value.query;
      if (form.form.value.id?.length) media['id'] = form.form.value.id;
    }

    this.mediaService.addRawMedia(media);

    form.reset();

    this.keyboard.clearInput('artist');
    this.keyboard.clearInput('title');
    this.keyboard.clearInput('id');
    this.keyboard.clearInput('query');
  }

  validate() {
    const artist = this.keyboard.getInput('artist');
    const title = this.keyboard.getInput('title');
    const id = this.keyboard.getInput('id');
    const query = this.keyboard.getInput('query');

    this.valid = (
      (title?.length && artist?.length && !(query?.length) && !(id?.length))
      ||
      (query?.length && !(title?.length) && !(id?.length))
      ||
      (id?.length && !(title?.length) && !(query?.length))
    )
  }
}
