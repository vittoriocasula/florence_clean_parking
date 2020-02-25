import { Injectable } from '@angular/core';
import { Device } from '../models/device.model';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  public connectionState: boolean;
  public connectedDevice: Device;

  constructor() { }

  connect(device: Device) {
    this.connectedDevice = device;
    this.connectionState = true;
  }

  disconnect() {
    this.connectionState = false;
  }
}
