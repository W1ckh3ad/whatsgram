import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import {
  AlertController,
  IonContent,
  IonicSlides,
  ModalController,
} from '@ionic/angular';
import { GroupCreate } from 'shared/models/group-create.model';
import { SortedContactsPart } from '@models/sortedContacts.model';
import { WhatsgramUser } from 'shared/models/whatsgram.user.model';
import { AccountService } from '@services/account/account.service';
import { GroupService } from '@services/group/group.service';
import { BehaviorSubject, combineLatestWith, map, Observable } from 'rxjs';
import { sortContactsIntoLetterSegments } from '@utils/contacts.utils';
import SwiperCore, { Pagination, Swiper, SwiperOptions, Zoom } from 'swiper';

SwiperCore.use([Pagination, Zoom, IonicSlides]);
@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss'],
})
export class CreateGroupComponent implements OnInit {
  @ViewChild(IonContent, { static: true }) ionContent: IonContent;
  @ViewChild('groupFormRef', { static: false }) groupFormRef: NgForm;

  swiperInstance: Swiper;
  public groupForm: FormGroup;

  generalData = 'General Data';
  members = 'Members';
  summary = 'Summery';
  maxMemberCount = 20;

  config: SwiperOptions = {
    spaceBetween: 50,
    pagination: { clickable: false },
    scrollbar: false,
    noSwiping: true,
    allowTouchMove: false,
  };

  public slides = [this.generalData, this.members, this.summary];
  public currentSlide = this.generalData;

  group = new GroupCreate('', '', '', []);
  search$ = new BehaviorSubject('');
  contacts$: Observable<SortedContactsPart[]> = null;
  addedMembers: WhatsgramUser[] = [];

  constructor(
    private modalController: ModalController,
    private account: AccountService,
    private alertCtrl: AlertController,
    private groupService: GroupService
  ) {}

  setSwiterInstance(swiperInstance: Swiper) {
    this.swiperInstance = swiperInstance;
  }

  onSlideChange(e) {
    this.currentSlide = this.slides[this.swiperInstance.activeIndex];
  }
  ngOnInit() {
    this.setupForm();
    this.contacts$ = this.account.contacts$.pipe(
      combineLatestWith(this.search$),
      map(([contacts, search]) =>
        contacts.filter(
          (y) =>
            y.displayName.toLowerCase().includes(search) ||
            y.email.toLowerCase().includes(search)
        )
      ),
      map(sortContactsIntoLetterSegments)
    );
  }

  setupForm() {
    this.groupForm = new FormGroup({
      displayName: new FormControl('', Validators.required),
      photoURL: new FormControl(''),
      description: new FormControl(''),
    });
  }

  async onBackButtonTouched() {
    if (this.swiperInstance.isBeginning) {
      await this.dismissModal();
      return;
    }
    this.swiperInstance.slidePrev();
  }

  onNextButtonTouched() {
    if (this.currentSlide === this.generalData) {
      this.groupFormRef.onSubmit(undefined);

      if (!this.groupForm.valid) {
        this.ionContent.scrollToTop();
        return;
      } else {
        this.group.description = this.groupDescription.value;
        this.group.displayName = this.groupDisplayName.value;
        this.group.photoURL = this.groupPhotoURL.value;
      }
    }

    if (!this.swiperInstance.isEnd) {
      this.swiperInstance.slideNext();
      return;
    }
  }

  get groupDisplayName(): AbstractControl {
    return this.groupForm.get('displayName');
  }

  get groupPhotoURL(): AbstractControl {
    return this.groupForm.get('photoURL');
  }

  get groupDescription(): AbstractControl {
    return this.groupForm.get('description');
  }

  onSearch(e) {
    this.search$.next(e.target.value.toLowerCase());
  }

  handleClick(e, contact) {
    const index = this.addedMembers.indexOf(contact);
    if (e.detail.checked && index === -1) {
      this.addedMembers.push(contact);
    } else if (!e.detail.checked && index !== -1) {
      this.addedMembers.splice(index, 1);
    }
  }

  async onSubmit() {
    if (this.group.displayName === '') {
      const alert = await this.alertCtrl.create({
        header: 'Validation error',
        subHeader: 'Group name must be defined',
      });
      await alert.present();
      this.swiperInstance.slideTo(0, 300);
      return;
    }
    this.group.members = [
      ...this.addedMembers.map((x) => ({
        ...x,
      })),
    ];

    await this.groupService.create(this.group, this.account.user$.value);
    this.dismissModal();
  }

  async dismissModal() {
    await this.modalController.dismiss();
  }
}
