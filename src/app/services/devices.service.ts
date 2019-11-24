import { Injectable } from '@angular/core';
import { Device } from '../models/device.model';

@Injectable({
  providedIn: 'root'
})
export class DevicesService {
  private devices = [];

  constructor() { }

  add(device: Device) {
    this.devices.push(device);
  }

  getDevice(mac: string): Device {
    return this.devices.find(device => {
      return device.mac === mac;
    });
  }
}
