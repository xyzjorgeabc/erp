import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-warning-panel',
  templateUrl: './warning-panel.component.html',
  styleUrls: ['./warning-panel.component.css']
})
export class WarningPanelComponent implements OnInit {
  @HostBinding('class.active-errors')
  public activeErrors: boolean;
  public _errors: Set<ValidationErrors>;
  constructor() {
    this._errors = null;
   }

  ngOnInit() {
  }
  @Input()
  set errors (val: Set<ValidationErrors>) {
    this._errors = val;
    this.activeErrors = !!val.size;
  }

}
