import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { IonContent, IonicSlides, ModalController } from '@ionic/angular';
import { GroupCreate } from '@models/group-create.model';
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
  @ViewChild('addMemberFormRef', { static: false }) addMemberFormRef: NgForm;
  @ViewChild('paymentFormRef', { static: false }) paymentFormRef: NgForm;

  swiperInstance: Swiper;
  public groupForm: FormGroup;
  public paymentForm: FormGroup;
  public addMemberForm: FormGroup;

  generalData = 'General Data';
  members = 'Members';
  summary = 'Summery';

  config: SwiperOptions = {
    spaceBetween: 50,
    pagination: { clickable: false },
    scrollbar: false,
    noSwiping: true,
    allowTouchMove: false,
  };

  public slides = [this.generalData, this.members, this.summary];
  public currentSlide = this.generalData;

  public isBeginning: boolean = true;
  public isEnd: boolean = false;
  model = new GroupCreate('', '', '', []);
  constructor(private modalController: ModalController) {}

  setSwiterInstance(swiperInstance: Swiper) {
    this.swiperInstance = swiperInstance;
  }

  onSlideChange(e) {
    this.currentSlide = this.slides[this.swiperInstance.activeIndex];
  }
  ngOnInit() {
    this.setupForm();
  }

  setupForm() {
    this.groupForm = new FormGroup({
      displayName: new FormControl('', Validators.required),
      photoURL: new FormControl(''),
      description: new FormControl(''),
    });

    this.addMemberForm = new FormGroup({
      address: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      delivery_time: new FormControl(null, Validators.required),
      note: new FormControl(''),
    });

    this.paymentForm = new FormGroup({
      number: new FormControl('', Validators.required),
      expiration: new FormControl('', Validators.required),
      cvv: new FormControl('', Validators.required),
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

  get shippingAddress(): AbstractControl {
    return this.addMemberForm.get('address');
  }

  get shippingPhone(): AbstractControl {
    return this.addMemberForm.get('phone');
  }

  get shippingDeliveryTime(): AbstractControl {
    return this.addMemberForm.get('delivery_time');
  }

  get paymentNumber(): AbstractControl {
    return this.paymentForm.get('number');
  }

  get paymentExpiration(): AbstractControl {
    return this.paymentForm.get('expiration');
  }

  get paymentCvv(): AbstractControl {
    return this.paymentForm.get('cvv');
  }

  async onSubmit() {}
  async dismissModal() {
    await this.modalController.dismiss();
  }
}
