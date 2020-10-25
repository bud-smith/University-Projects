import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  location: string;
  type: string;
  icon: string;
  temperature: string;
  country: string;

  data: any;

  covidData: any;
  confirmed: any;
  deaths: any;
  recovered: any;
  active: any;
  flag: any;

  longitude: number;
  latitude: number;
  longitudeCheck: number;
  latitudeCheck: number;

  locationCheck = false;

  constructor(private httpClient: HttpClient,
              private gelocation: Geolocation,
              private platform: Platform,
              private inAppBrowser: InAppBrowser,
              private serviceService: ServiceService) {
                this.platform.ready().then(() => { // Ensures location persmissions are enabled.
                  this.getLocation();
                });
  }

  async ionViewWillEnter() { // Refreshes page once the user reclicks on this tab.
    await this.serviceService.getLong().then((data) => {
      this.longitudeCheck = data;
    });
    await this.serviceService.getLong().then((data) => {
      this.latitudeCheck = data;
    });

    if (this.longitudeCheck !== this.longitude && this.latitudeCheck !== this.latitude) {
      this.locationCheck = false;
      this.getLocation();
      this.locationCheck = true;
    }
  }

  async getLocation() { // Stores longitude and latitude of user location
    await this.serviceService.getLat().then((data) => {
      this.latitude = data;
    });

    await this.serviceService.getLong().then((data) => {
      this.longitude = data;
    });

    if (this.longitude == null || this.latitude == null) {
      this.gelocation.getCurrentPosition().then((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.serviceService.setLocation(this.longitude, this.latitude);
        this.getTemperature(this.latitude, this.longitude);
      });
    } else {
      this.getTemperature(this.latitude, this.longitude);
    }
  }

  getTemperature(latitude: any, longitude: any) { // Weather API handler.
    // tslint:disable-next-line: max-line-length
    const url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=API_KEY';

    this.httpClient.get(url).subscribe((temperatureData) => { // Weather API response stored.
      const obj = temperatureData as any;
      this.location = obj.name;
      this.type = obj.weather[0].main;
      this.icon = 'https://openweathermap.org/img/wn/' + obj.weather[0].icon + '@2x.png';
      this.temperature = ((parseFloat(obj.main.temp) - 273.15).toFixed(1)).toString() + '°C';
      this.country = obj.sys.country;
      this.getCovid(this.country);
      this.getNews(this.country);
    });
  }

  getCovid(country: any) { // Gets COVID-19 data from online API
    const url = 'https://corona.lmao.ninja/v2/countries/' + country;

    this.httpClient.get(url).subscribe((covidInfo) => {
      this.covidData = covidInfo as any;
      this.country = this.covidData.country;
      this.confirmed = this.covidData.cases;
      this.deaths = this.covidData.deaths;
      this.recovered = this.covidData.recovered;
      this.active = this.confirmed - (this.recovered + this.deaths);

      this.flag = this.covidData.countryInfo.flag;
      this.locationCheck = true;
    });
  }

  getNews(country: any) { // News API handler.
    const url = 'https://newsapi.org/v2/top-headlines?country=' + country + '&sortBy=popularity&apiKey=API_KEY';
    this.httpClient.get(url).subscribe(data => { // News API response stored.
      this.data = data;
    });
  }

  openBrowser(url: any) { // In-app browser function.
    this.inAppBrowser.create(url, '_blank');
  }

  stripHtmlTags(description: any) { // Regex to strip unwanted tags from news description.
    if (description !== null) {
      return description.replace(/(<([^>]+)>)/ig, '');
    }
    return '';
  }

  checkImageUrl(url: any) { // Checks if image url is valid before displaying article.
    if (url == null || url.substring(0, 4).toLowerCase() !== 'http') {
      return false;
    }
    return true;
  }
}
