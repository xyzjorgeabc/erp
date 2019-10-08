import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @HostBinding('class.menu-abierto')
  private AbrirMenu = false;
  constructor() {
  }

  ngOnInit() {
  }
  toggleMenu(): void {
    this.AbrirMenu = !this.AbrirMenu;
  }

}
