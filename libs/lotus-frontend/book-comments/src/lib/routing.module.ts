import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookCommentsComponent } from './book-comments/book-comments.component';

const routes: Routes = [{ path: '', component: BookCommentsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookCommentsRoutingModule {}
