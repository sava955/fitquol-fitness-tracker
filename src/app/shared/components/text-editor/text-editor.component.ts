import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-text-editor',
  imports: [MatButtonModule, MatIcon, MatToolbarModule],
  templateUrl: './text-editor.component.html',
  styleUrl: './text-editor.component.scss',
})
export class TextEditorComponent {
  @ViewChild('editor') editor!: ElementRef;
  @Input() text: string = '';
  @Output() textEntered = new EventEmitter<string>();

  private readonly sanitizer = inject(DomSanitizer);

  getSafeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  applyStyle(style: string): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();
    if (!selectedText) return;

    // Determine the container of the selection
    let container = range.commonAncestorContainer as HTMLElement;
    if (container.nodeType !== Node.ELEMENT_NODE) {
      container = container.parentElement!;
    }

    // Check if the selection is already wrapped in a <span> with the requested style
    let isStyled = false;
    if (container && container.tagName === 'SPAN') {
      switch (style) {
        case 'heading':
          isStyled = container.style.fontSize === '20px';
          break;
        case 'bold':
          isStyled = container.style.fontWeight === 'bold';
          break;
        case 'italic':
          isStyled = container.style.fontStyle === 'italic';
          break;
        case 'underline':
          isStyled = container.style.textDecoration === 'underline';
          break;
      }
    }

    if (isStyled) {
      // Toggle off: Remove the styling by unwrapping the span.
      const parent = container.parentElement;
      if (parent) {
        // Move all children of the span back to the parent
        while (container.firstChild) {
          parent.insertBefore(container.firstChild, container);
        }
        parent.removeChild(container);
      }
    } else {
      // Apply the requested formatting by wrapping the selection in a new span.
      const span = document.createElement('span');
      switch (style) {
        case 'heading':
          span.style.fontSize = '20px';
          break;
        case 'bold':
          span.style.fontWeight = 'bold';
          break;
        case 'italic':
          span.style.fontStyle = 'italic';
          break;
        case 'underline':
          span.style.textDecoration = 'underline';
          break;
      }
      span.appendChild(range.extractContents());
      range.insertNode(span);
    }

    // Clear selection so the change is visually updated.
    selection.removeAllRanges();

    this.updateContent();
  }

  insertList(type: 'ul' | 'ol') {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();
    if (!selectedText) return;

    // Check if the selection is within an existing list item of the same type.
    let container = range.commonAncestorContainer as HTMLElement;
    if (container.nodeType !== Node.ELEMENT_NODE) {
      container = container.parentElement!;
    }
    const listItem = container.closest('li');
    if (listItem && listItem.parentElement?.tagName.toLowerCase() === type) {
      // Toggle off: Remove the list formatting by replacing the list item with plain text.
      const list = listItem.parentElement;
      const textNode = document.createTextNode(listItem.textContent || '');
      list.parentElement?.insertBefore(textNode, list);
      list.removeChild(listItem);
      // If the list is empty after removal, remove the list element.
      if (list.children.length === 0) {
        list.parentElement?.removeChild(list);
      }
    } else {
      // Otherwise, create a new list and insert the selected text as a list item.
      const list = document.createElement(type);
      const li = document.createElement('li');
      li.textContent = selectedText;
      list.appendChild(li);

      range.deleteContents();
      range.insertNode(list);

      // Optionally, select the new list so that the user can see the update.
      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNodeContents(list);
      selection.addRange(newRange);
    }

    this.updateContent();
  }

  onKeyDown(event: KeyboardEvent) {
    // Check if Shift + Enter is pressed
    if (event.key === 'Enter' && event.shiftKey) {
      this.breakList();
    }
  }

  breakList() {
    const selection = window.getSelection()!;
    const range = selection.getRangeAt(0);
    let startContainer = range.startContainer;

    // If the startContainer is a TextNode, get the parentElement which is an Element
    if (startContainer.nodeType === Node.TEXT_NODE) {
      startContainer = startContainer.parentElement!;
    }

    // Ensure the startContainer is an Element before calling closest()
    if (startContainer instanceof Element) {
      const listItem = startContainer.closest('li');
      if (listItem) {
        const textNode = document.createTextNode(listItem.textContent?.slice(range.startOffset) || '');
        const newLi = document.createElement('li');
        newLi.appendChild(textNode);
        listItem.parentElement?.insertBefore(newLi, listItem.nextSibling);

        // Move the cursor to the new list item.
        const newRange = document.createRange();
        newRange.setStart(newLi.firstChild!, 0);
        newRange.setEnd(newLi.firstChild!, 0);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }

    this.updateContent();
  }

  updateContent() {
    const content = this.editor.nativeElement.innerHTML; // Access the content of the editor
    this.textEntered.emit(content); 
  }
}
