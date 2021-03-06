import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { SocketService } from './socket.service';
import { UsersOutParam } from '../model/usersOutParam';
import { PortraitParam } from '../model/portraitParam';

@Injectable()
export class ContactService {

  private contacts: Map<string, UsersOutParam>;
  constructor(
    private restClient: RestService,
    private socketClient: SocketService) { 
      this.contacts = new Map<string, UsersOutParam>();
    }

  getUsers(): void {
    if (this.contacts.size > 0) {
      return;
    }
    this.restClient.getUsers().subscribe((result) => {
      console.log("User list length:" + result.data.length);
      let loginUser = this.socketClient.loginUserId;
      result.data.forEach((contact) => {
        if (loginUser != contact.id) {
          this.contacts.set(contact.id, contact);
        }
      });
    });
  }

  getUserDetail(uid: string): UsersOutParam {
    return this.contacts.get(uid);
  }

  getUserIdList(): Array<string> {
    let array = [];
    this.contacts.forEach(contact => {
      let loginUserId = this.socketClient.loginUserId;
      if (loginUserId != contact.id) {
        array.push(contact.id)
      }
    });
    return array;
  }

  getUserList(): Array<UsersOutParam> {
    let array = [];
    this.contacts.forEach(contact => {
      let loginUserId = this.socketClient.loginUserId;
      if (loginUserId != contact.id) {
        array.push(contact)
      }
    });
    return array;
  }
  
  setPortrait(uid: string, url: string) {
    let userInfo = this.contacts.get(uid);
    userInfo.portrait = url;
    this.contacts.set(uid, userInfo);
    this.restClient.updateUserPortrait(uid, new PortraitParam(url)).subscribe((result) => {
      if (result.code != 10000) {
        console.log("update portrait failed " + uid + " " + url);
      }
    });
  }

  clear(): void {
    this.contacts.clear();
  }
}
