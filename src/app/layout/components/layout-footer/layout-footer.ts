import { Component } from '@angular/core';

@Component({
  selector: 'layout-footer',
  imports: [],
  templateUrl: './layout-footer.html',
  styleUrl: './layout-footer.scss',
})
export class LayoutFooter {
  readonly appName = 'AtlasCore';
  readonly appVersion = '0.1.0';
  readonly environment = 'Development';
}
