import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntityOwnershipGroupControllerService } from './entity-ownership-group-controller.service';

@NgModule({
  imports: [CommonModule],
  providers: [EntityOwnershipGroupControllerService],
})
export class EntityOwnershipModule {}
