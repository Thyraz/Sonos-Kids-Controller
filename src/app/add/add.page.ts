import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { NavController, IonSelect, IonInput, IonSegment } from '@ionic/angular';
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
  @ViewChild('segment', { static: false }) segment: IonSegment;
  @ViewChild('select', { static: false }) select: IonSelect;

  @ViewChild('library_segment', { static: false }) librarySegment: IonSelect;
  @ViewChild('spotify_segment', { static: false }) spotifySegment: IonSelect;
  @ViewChild('amazonmusic_segment', { static: false }) amazonmusicSegment: IonSelect;
  @ViewChild('applemusic_segment', { static: false }) applemusicSegment: IonSelect;
  @ViewChild('tunein_segment', { static: false }) tuneinSegment: IonSelect;

  @ViewChild('library_artist', { static: false }) libraryArtist: IonInput;
  @ViewChild('library_title', { static: false }) libraryTitle: IonInput;
  @ViewChild('library_cover', { static: false }) libraryCover: IonInput;
  @ViewChild('spotify_artist', { static: false }) spotifyArtist: IonInput;
  @ViewChild('spotify_id', { static: false }) spotifyID: IonInput;
  @ViewChild('spotify_title', { static: false }) spotifyTitle: IonInput;
  @ViewChild('spotify_query', { static: false }) spotifyQuery: IonInput;
  @ViewChild('amazonmusic_artist', { static: false }) amazonmusicArtist: IonInput;
  @ViewChild('amazonmusic_id', { static: false }) amazonmusicID: IonInput;
  @ViewChild('amazonmusic_title', { static: false }) amazonmusicTitle: IonInput;
  @ViewChild('amazonmusic_cover', { static: false }) amazonmusicCover: IonInput;
  @ViewChild('applemusic_artist', { static: false }) applemusicArtist: IonInput;
  @ViewChild('applemusic_id', { static: false }) applemusicID: IonInput;
  @ViewChild('applemusic_title', { static: false }) applemusicTitle: IonInput;
  @ViewChild('applemusic_cover', { static: false }) applemusicCover: IonInput;
  @ViewChild('tunein_title', { static: false }) tuneinTitle: IonInput;
  @ViewChild('tunein_id', { static: false }) tuneinID: IonInput;
  @ViewChild('tunein_cover', { static: false }) tuneinCover: IonInput;

  source = 'spotify';
  category = 'audiobook';
  keyboard: Keyboard;
  selectedInputElem: any;
  valid = false;

  categoryIcons = {
    audiobook: 'book-outline',
    music: 'musical-notes-outline',
    playlist: 'document-text-outline',
    radio: 'radio-outline'
  };

  constructor(
    private mediaService: MediaService,
    private navController: NavController
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.tuneinSegment.disabled = true;

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

  cancelButtonPressed() {
    this.navController.back();
  }

  categoryButtonPressed(event: any) {
    this.select.open(event);
  }

  categoryChanged() {
    if (this.category === 'radio' && this.source !== 'tunein') {
      this.source = 'tunein';
    } else if (this.category !== 'radio' && this.source === 'tunein') {
      this.source = 'spotify';
    }

    this.validate();
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
    window.setTimeout(() => { // wait for new elements to be visible before altering them
      this.validate();
    }, 10);
  }

  submit(form: NgForm) {
    const media: Media = {
      type: this.source,
      category: this.category
    };

    if (this.source === 'spotify') {
      if (form.form.value.spotify_artist?.length) { media.artist = form.form.value.spotify_artist; }
      if (form.form.value.spotify_title?.length) { media.title = form.form.value.spotify_title; }
      if (form.form.value.spotify_query?.length) { media.query = form.form.value.spotify_query; }
      if (form.form.value.spotify_id?.length) { media.id = form.form.value.spotify_id; }

    } else if (this.source === 'library') {
      if (form.form.value.library_artist?.length) { media.artist = form.form.value.library_artist; }
      if (form.form.value.library_title?.length) { media.title = form.form.value.library_title; }
      if (form.form.value.library_cover?.length) { media.cover = form.form.value.library_cover; }

    } else if (this.source === 'amazonmusic') {
      if (form.form.value.amazonmusic_artist?.length) { media.artist = form.form.value.amazonmusic_artist; }
      if (form.form.value.amazonmusic_title?.length) { media.title = form.form.value.amazonmusic_title; }
      if (form.form.value.amazonmusic_cover?.length) { media.cover = form.form.value.amazonmusic_cover; }
      if (form.form.value.amazonmusic_id?.length) { media.id = form.form.value.amazonmusic_id; }

    } else if (this.source === 'applemusic') {
      if (form.form.value.applemusic_artist?.length) { media.artist = form.form.value.applemusic_artist; }
      if (form.form.value.applemusic_title?.length) { media.title = form.form.value.applemusic_title; }
      if (form.form.value.applemusic_cover?.length) { media.cover = form.form.value.applemusic_cover; }
      if (form.form.value.applemusic_id?.length) { media.id = form.form.value.applemusic_id; }

    } else if (this.source === 'tunein') {
      if (form.form.value.tunein_title?.length) { media.title = form.form.value.tunein_title; }
      if (form.form.value.tunein_cover?.length) { media.cover = form.form.value.tunein_cover; }
      if (form.form.value.tunein_id?.length) { media.id = form.form.value.tunein_id; }
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

    this.keyboard.clearInput('tunein_title');
    this.keyboard.clearInput('tunein_id');
    this.keyboard.clearInput('tunein_cover');

    this.validate();

    this.navController.back();
  }

  validate() {
    if (this.librarySegment) { this.librarySegment.disabled = false; }
    if (this.spotifySegment) { this.spotifySegment.disabled = false; }
    if (this.amazonmusicSegment) { this.amazonmusicSegment.disabled = false; }
    if (this.applemusicSegment) { this.applemusicSegment.disabled = false; }
    if (this.tuneinSegment) { this.tuneinSegment.disabled = false; }

    if (this.libraryArtist) { this.libraryArtist.disabled = false; }
    if (this.spotifyArtist) { this.spotifyArtist.disabled = false; }
    if (this.spotifyQuery) { this.spotifyQuery.disabled = false; }
    if (this.amazonmusicArtist) { this.amazonmusicArtist.disabled = false; }
    if (this.applemusicArtist) { this.applemusicArtist.disabled = false; }

    switch (this.category) {
      case 'audiobook':
      case 'music':
        if (this.tuneinSegment) { this.tuneinSegment.disabled = true; }
        break;
      case 'playlist':
        if (this.tuneinSegment) { this.tuneinSegment.disabled = true; }
        if (this.libraryArtist) { this.libraryArtist.disabled = true; }
        if (this.spotifyArtist) { this.spotifyArtist.disabled = true; }
        if (this.spotifyQuery) { this.spotifyQuery.disabled = true; }
        if (this.amazonmusicArtist) { this.amazonmusicArtist.disabled = true; }
        if (this.applemusicArtist) { this.applemusicArtist.disabled = true; }
        break;
      case 'radio':
        if (this.librarySegment) { this.librarySegment.disabled = true; }
        if (this.spotifySegment) { this.spotifySegment.disabled = true; }
        if (this.amazonmusicSegment) { this.amazonmusicSegment.disabled = true; }
        if (this.applemusicSegment) { this.applemusicSegment.disabled = true; }
    }

    if (this.source === 'spotify') {
      const artist = this.keyboard.getInput('spotify_artist');
      const title = this.keyboard.getInput('spotify_title');
      const id = this.keyboard.getInput('spotify_id');
      const query = this.keyboard.getInput('spotify_query');

      this.valid = (
        (this.category === 'audiobook' || this.category === 'music') && (
          (title?.length > 0 && artist?.length > 0 && !(query?.length > 0) && !(id?.length > 0))
          ||
          (query?.length > 0 && !(title?.length > 0) && !(id?.length > 0))
          ||
          (id?.length > 0 && !(query?.length > 0))
        )
        ||
        this.category === 'playlist' && id?.length > 0
      );
    } else if (this.source === 'library') {
      const artist = this.keyboard.getInput('library_artist');
      const title = this.keyboard.getInput('library_title');

      this.valid = (
        (this.category === 'audiobook' || this.category === 'music') && (
          title?.length > 0 && artist?.length > 0
        )
        ||
        this.category === 'playlist' && title?.length > 0
      );
    } else if (this.source === 'amazonmusic') {
      const artist = this.keyboard.getInput('amazonmusic_artist');
      const title = this.keyboard.getInput('amazonmusic_title');
      const id = this.keyboard.getInput('amazonmusic_id');

      this.valid = (
        (this.category === 'audiobook' || this.category === 'music') && (
          artist?.length > 0 && title?.length > 0 && id?.length > 0
        )
        ||
        this.category === 'playlist' && title?.length > 0 && id?.length > 0
      );
    } else if (this.source === 'applemusic') {
      const artist = this.keyboard.getInput('applemusic_artist');
      const title = this.keyboard.getInput('applemusic_title');
      const id = this.keyboard.getInput('applemusic_id');

      this.valid = (
        (this.category === 'audiobook' || this.category === 'music') && (
          artist?.length > 0 && title?.length > 0 && id?.length > 0
        )
        ||
        this.category === 'playlist' && title?.length > 0 && id?.length > 0
      );
    } else if (this.source === 'tunein') {
      const artist = this.keyboard.getInput('tunein_artist');
      const title = this.keyboard.getInput('tunein_title');
      const id = this.keyboard.getInput('tunein_id');

      this.valid = (
        title?.length > 0 && id?.length > 0
      );
    }
  }
}
