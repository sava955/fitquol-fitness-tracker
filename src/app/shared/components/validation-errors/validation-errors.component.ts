import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-validation-errors',
  imports: [CommonModule],
  templateUrl: './validation-errors.component.html',
  styleUrl: './validation-errors.component.scss',
})
export class ValidationErrorsComponent {
  @Input() errors: Record<string, ValidationErrors> | null = {};

  errorMessages: ValidationErrors = {
    required: 'This field is required',
    passwordMismatch: 'passwordMismatch',
    invalidNumberFormat: 'Only one decimal place is allowed (ex. 14.2)',
    min: 'This value is below minimum',
    max: 'This value is above maximum',
    maxlength: 'Text is too long',
  };
}
