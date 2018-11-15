import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { BookmarkService } from '../bookmark.service';
import { MatDialog } from '@angular/material';
import { DialogEditBookmarkComponent } from '../dialog-edit-bookmark/dialog-edit-bookmark.component';
import { Bookmark } from '../bookmark.model';
import { fadeAnimation } from '../../ui/animations/fade.ani';

@Component({
  selector: 'bookmark-bar',
  templateUrl: './bookmark-bar.component.html',
  styleUrls: ['./bookmark-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeAnimation],
})
export class BookmarkBarComponent implements OnInit {
  isDragOver = false;
  dragEnterTarget: HTMLElement;

  @HostListener('dragenter', ['$event']) onDragEnter(ev: Event) {
    this.dragEnterTarget = ev.target as HTMLElement;
    ev.preventDefault();
    this.isDragOver = true;
  }

  @HostListener('dragleave', ['$event']) onDragLeave(ev: Event) {
    if (this.dragEnterTarget === (event.target as HTMLElement)) {
      event.preventDefault();
      this.isDragOver = false;
    }
  }

  @HostListener('drop', ['$event']) onDrop(ev: Event) {
    this.bookmarkService.createFromDrop(ev);
    this.isDragOver = false;
  }

  constructor(
    public readonly bookmarkService: BookmarkService,
    private readonly _matDialog: MatDialog,
  ) {
  }

  ngOnInit() {
  }

  openEditDialog(bookmark?: Bookmark) {
    this._matDialog.open(DialogEditBookmarkComponent, {
      data: {
        bookmark: bookmark
      },
    }).afterClosed()
      .subscribe((bookmark_) => {
        if (bookmark_) {
          if (bookmark_.id) {
            this.bookmarkService.updateBookmark(bookmark_.id, bookmark_);
          } else {
            this.bookmarkService.addBookmark(bookmark_);
          }
        }
      });
  }
}
