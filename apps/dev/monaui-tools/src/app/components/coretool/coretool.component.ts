import { Component } from '@angular/core';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { minky, minkyRoot, Reform } from '@lotus/front-global/minky/core';

@minkyRoot()
class GenerateReformOfDto {
  @minky({})
  typescriptDtoFilePath: string = '';

  @minky({})
  typescriptExportFilePath: string = '';
}

@Component({
  selector: 'app-coretool',
  standalone: false,
  templateUrl: './coretool.component.html',
  styleUrl: './coretool.component.scss',
})
export class CoretoolComponent {
  constructor(private secOverlay: BasicOverlayService) {}

  runReformOfDto() {
    const reform = new Reform(GenerateReformOfDto);
    this.secOverlay
      .reformDialog(reform, "DTO'dan Reform'a")
      .subscribe((a) => {});
  }

  title = 'monaui-tools';
}
