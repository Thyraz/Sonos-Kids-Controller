import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild, NgModule } from '@angular/core';
import { MediaService } from '../media.service';
import { Media } from '../media';
import Keyboard from 'simple-keyboard';
import { NgForm } from '@angular/forms';


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
    this.validate();
  }

  submit(form: NgForm) {
    const media: Media = {
      type: this.source
    };

    if (this.source === 'spotify') {
      if (form.form.value.spotify_artist?.length) { media['artist'] = form.form.value.spotify_artist; }
      if (form.form.value.spotify_title?.length) { media['title'] = form.form.value.spotify_title; }
      if (form.form.value.spotify_query?.length) { media['query'] = form.form.value.spotify_query; }
      if (form.form.value.spotify_id?.length) { media['id'] = form.form.value.spotify_id; }

    } else if (this.source === 'library') {
      if (form.form.value.library_artist?.length) { media['artist'] = form.form.value.library_artist; }
      if (form.form.value.library_title?.length) { media['title'] = form.form.value.library_title; }
      if (form.form.value.library_cover?.length) { media['cover'] = form.form.value.library_cover; }

    } else if (this.source === 'amazonmusic') {
      if (form.form.value.amazonmusic_artist?.length) { media['artist'] = form.form.value.amazonmusic_artist; }
      if (form.form.value.amazonmusic_title?.length) { media['title'] = form.form.value.amazonmusic_title; }
      if (form.form.value.amazonmusic_cover?.length) { media['cover'] = form.form.value.amazonmusic_cover; }
      if (form.form.value.amazonmusic_id?.length) { media['id'] = form.form.value.amazonmusic_id; }

    } else if (this.source === 'applemusic') {
      if (form.form.value.applemusic_artist?.length) { media['artist'] = form.form.value.applemusic_artist; }
      if (form.form.value.applemusic_title?.length) { media['title'] = form.form.value.applemusic_title; }
      if (form.form.value.applemusic_cover?.length) { media['cover'] = form.form.value.applemusic_cover; }
      if (form.form.value.applemusic_id?.length) { media['id'] = form.form.value.applemusic_id; }
    }

    this.mediaService.addRawMedia(media);

    form.reset();

    this.keyboard.clearInput('spotify_artist');
    this.keyboard.clearInput('spotify_title');
    this.keyboard.clearInput('spotify_id');
    this.keyboard.clearInput('spotify_query');

    this.keyboard.clearInput('library_artist');
    this.keyboard.clearInput('library_title');
    this.keyboard.clearInput('library_cover');

    this.keyboard.clearInput('amazonmusic_artist');
    this.keyboard.clearInput('amazonmusic_title');
    this.keyboard.clearInput('amazonmusic_id');
    this.keyboard.clearInput('amazonmusic_cover');

    this.keyboard.clearInput('applemusic_artist');
    this.keyboard.clearInput('applemusic_title');
    this.keyboard.clearInput('applemusic_id');
    this.keyboard.clearInput('applemusic_cover');

    this.validate();
  }

  validate() {
    if (this.source === 'spotify') {
      const artist = this.keyboard.getInput('spotify_artist');
      const title = this.keyboard.getInput('spotify_title');
      const id = this.keyboard.getInput('spotify_id');
      const query = this.keyboard.getInput('spotify_query');

      this.valid = (
        (title?.length > 0 && artist?.length > 0 && !(query?.length > 0) && !(id?.length > 0))
        ||
        (query?.length > 0 && !(title?.length > 0) && !(id?.length > 0))
        ||
        (id?.length > 0 && !(query?.length > 0))
      );
    } else if (this.source === 'library') {
      const artist = this.keyboard.getInput('library_artist');
      const title = this.keyboard.getInput('library_title');

      this.valid = (
        title?.length > 0 && artist?.length > 0
      );
    } else if (this.source === 'amazonmusic') {
      const artist = this.keyboard.getInput('amazonmusic_artist');
      const title = this.keyboard.getInput('amazonmusic_title');
      const id = this.keyboard.getInput('amazonmusic_id');

      this.valid = (
        artist?.length > 0 && title?.length > 0 && id?.length > 0
      );
    } else if (this.source === 'applemusic') {
      const artist = this.keyboard.getInput('applemusic_artist');
      const title = this.keyboard.getInput('applemusic_title');
      const id = this.keyboard.getInput('applemusic_id');

      this.valid = (
        artist?.length > 0 && title?.length > 0 && id?.length > 0
      );
    }
  }
}
