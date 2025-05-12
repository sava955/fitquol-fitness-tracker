import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormComponent } from '../../../../../shared/components/form/form.component';
import { ActionButtons } from '../../../../../core/models/action.buttons.interface';
import { AddEdit } from '../../../../../core/enums/add-edit.enum';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { PageTitleComponent } from '../../../../../shared/components/page-title/page-title.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DiaryExercise } from '../../../models/exercise.interface';
import { FormBaseComponent } from '../../../../../shared/components/form-base/form-base.component';
import { ResponseObj } from '../../../../../core/models/http-response.interface';
import { map, Observable } from 'rxjs';
import { exerciseActionButtons } from '../../../const/exercises.const';
import { DiaryService } from '../../../services/diary.service';
import { UserService } from '../../../../user/services/user.service';

@Component({
  selector: 'app-add-edit-exercise',
  imports: [
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormComponent,
    InputComponent,
    PageTitleComponent,
  ],
  templateUrl: './add-edit-exercise.component.html',
  styleUrl: './add-edit-exercise.component.scss',
})
export class AddEditExerciseComponent extends FormBaseComponent<DiaryExercise> {
  private readonly diaryService = inject(DiaryService);
  private readonly userService = inject(UserService);

  caloriesBurned = 0;

  exercise!: DiaryExercise;

  weight!: number;

  get sets() {
    return this.formGroup.get('sets');
  }

  get setDuration() {
    return this.formGroup.get('setDuration');
  }

  protected override setActionButtons(): ActionButtons[] {
    return exerciseActionButtons(
      this.goBack.bind(this),
      this.onSubmit.bind(this),
      this.mode
    );
  }

  protected override buildForm(): void {
    this.formGroup = this.fb.group({
      sets: [1, [Validators.required, Validators.min(1)]],
      setDuration: [0, [Validators.required, Validators.min(0)]],
    });

    this.userService
      .getAuthenticatedUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        if (response?.goals) {
          this.weight = response?.goals[response.goals.length - 1].weight;
        }

        this.sets?.setValue(this.exercise.sets);
        this.setDuration?.setValue(this.exercise.setDuration);
      });
  }

  protected override onFormEvent(): void {
    this.sets?.valueChanges.subscribe(() => {
      if (this.setDuration?.value! !== 0) {
        this.calculateCalories();
      }
    });

    this.setDuration?.valueChanges.subscribe(() => {
      this.calculateCalories();
    });
  }

  protected override getSubmitMethod(
    data: DiaryExercise,
    id?: string
  ): Observable<ResponseObj<DiaryExercise>> {
    if (this.mode === AddEdit.ADD) {
      return this.diaryService
        .save(data, 'exercise')
        .pipe(map((response) => response as ResponseObj<DiaryExercise>));
    }

    return this.diaryService
      .update(id!, data, 'exercise')
      .pipe(map((response) => response as ResponseObj<DiaryExercise>));
  }

  protected override onSubmit(): void {
    const exercise: DiaryExercise = {
      day: this.exercise.day,
      exercise: this.exercise.exercise,
      caloriesBurned: this.caloriesBurned,
      sets: this.formGroup.value.sets!,
      setDuration: this.formGroup.value.setDuration!,
    };

    this.submit(exercise, this.exercise._id);
  }

  protected override onSuccess(response: ResponseObj<DiaryExercise>): void {
    this.sidePanelService.closeTopComponent(response?.success);
  }

  private calculateCalories(): void {
    let duration: number;

    if (this.sets?.value && this.sets?.value > 0) {
      duration = this.setDuration?.value! * this.sets?.value;
    } else {
      duration = this.setDuration?.value;
    }

    this.caloriesBurned = Math.floor(
      this.exercise.exercise.mets * this.weight * (duration / 60)
    );
  }
}
