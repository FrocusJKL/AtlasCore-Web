import { Component, OnInit } from '@angular/core';
import { APPLICATION_CONFIG } from '../../../core/config/aplication.config';

@Component({
  selector: 'layout-footer',
  imports: [],
  templateUrl: './layout-footer.html',
  styleUrl: './layout-footer.scss',
})
export class LayoutFooter implements OnInit {
  constructor() {}

  readonly config = APPLICATION_CONFIG;

  ngOnInit(): void {}
}
