import { Component, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { ServiceService } from '../service.service';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';

declare let google: any;

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {

  @ViewChild('map',  { static: true }) mapElement: any;
  map: any;
  long: number;
  lat: number;
  address: string;
  label: any;

  constructor(private geolocation: Geolocation,
              private keyboard: Keyboard,
              private serviceService: ServiceService,
              private httpClient: HttpClient,
              private navCtrl: NavController) {
  }

  async ngOnInit() { // Checks for location data, if not, gets it, then sets up a map and pin structure to be displayed.

    await this.serviceService.getLong().then((data) => {
      if (data !== null) {
        this.long = data;
      }
    });

    await this.serviceService.getLat().then((data) => {
      if (data !== null) {
        this.lat = data;
      }
    });

    this.geolocation.getCurrentPosition().then((position) => {

      if (this.lat === undefined && this.long === undefined) {
        this.serviceService.setLocation(position.coords.longitude, position.coords.latitude);
        this.long = position.coords.longitude;
        this.lat = position.coords.latitude;
      }

      const latLng = new google.maps.LatLng(this.lat, this.long);
      const mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      const marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter(),
        title: this.address
      });

      // tslint:disable-next-line: max-line-length
      const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + this.lat + ',' + this.long + '&key=API_KEY';

      this.httpClient.get(url).subscribe((mapData) => {

        const obj = mapData as any;
        this.address = obj.results[0].formatted_address;

        marker.addListener('click', () => {
          this.navCtrl.navigateRoot('tabs/tab2');
        });
      });
    });
  }

  async closeKeyboard(label: any) { // Upon search closes the keyboard and changes stored location.
    this.keyboard.hide();

    const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + label + '&key=API_KEY';

    this.httpClient.get(url).subscribe((mapData) => { // Weather API response stored.
      const obj = mapData as any;

      this.address = obj.results[0].formatted_address;
      this.long = obj.results[0].geometry.location.lng;
      this.lat = obj.results[0].geometry.location.lat;
      this.serviceService.setLocation(this.long, this.lat);
      this.updateMap();
    });
  }

  updateMap() { // To dynamically update the map (copy paste from ngOnInit())

    this.geolocation.getCurrentPosition().then((position) => {
      if (this.lat === undefined && this.long === undefined) {
        this.serviceService.setLocation(position.coords.longitude, position.coords.latitude);
        this.long = position.coords.longitude;
        this.lat = position.coords.latitude;
      }

      const latLng = new google.maps.LatLng(this.lat, this.long);
      const mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      const marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter(),
        title: this.address
      });

      marker.addListener('click', () => {
        this.navCtrl.navigateRoot('tabs/tab2');
      });
    });
  }

  findCurrentLocation() { // For the button in html finds the users current location
    this.geolocation.getCurrentPosition().then((position) => {
      this.serviceService.setLocation(position.coords.longitude, position.coords.latitude);
      this.long = position.coords.longitude;
      this.lat = position.coords.latitude;
      this.serviceService.setLocation(this.long, this.lat);
      this.updateMap();
    });
  }
}
