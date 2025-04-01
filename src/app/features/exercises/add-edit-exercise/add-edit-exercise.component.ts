import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { DiaryExercise } from '../../../core/models/exercises/exercise.interface';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatCalendar,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
} from '../../../core/enums/exercises/exercise-planer.enum';
import { FormBaseComponent } from '../../../shared/components/form-base/form-base.component';
import { SidePanelService } from '../../../shared/services/side-panel/side-panel.service';
import { ActionButtons } from '../../../core/models/action-buttons/action.buttons.interface';
import { AddEdit } from '../../../core/enums/add-edit/add-edit.enum';
import { DiaryService } from '../../../core/services/diary/diary.service';
import { InputBaseComponent } from '../../../shared/components/input-base/input-base.component';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { ResponseObj } from '../../../core/models/http-response/http-response.interface';

@Component({
  selector: 'app-add-edit-exercise',
  imports: [
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormBaseComponent,
    InputBaseComponent,
    PageTitleComponent
  ],
  templateUrl: './add-edit-exercise.component.html',
  styleUrl: './add-edit-exercise.component.scss',
})
export class AddEditExerciseComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly sidePanelService = inject(SidePanelService);
  private readonly diaryService = inject(DiaryService);

  exerciseForm = this.fb.group({
    sets: [null, [Validators.required, Validators.min(0)]],
    setDuration: [null, [Validators.required, Validators.min(0)]],
  });

  caloriesBurned = 0;

  @ViewChild(MatCalendar) calendar!: MatCalendar<Date>;

  mode =
    this.sidePanelService.drawerStack()[
      this.sidePanelService.drawerStack().length - 1
    ]?.data.data?.mode;
  day =
    this.sidePanelService.drawerStack()[
      this.sidePanelService.drawerStack().length - 1
    ]?.data.data?.day;
  exercise =
    this.sidePanelService.drawerStack()[
      this.sidePanelService.drawerStack().length - 1
    ]?.data.data?.exercise;

  actionBtns: ActionButtons[] = [
    {
      label: 'Cancel',
      action: () => {
        this.sidePanelService.closeTopComponent();
      },
      style: 'secondary',
    },
    {
      label: this.mode === AddEdit.ADD ? 'Add exercise' : 'Update exercise',
      action: () => {
        this.mode === AddEdit.ADD ? this.addExercise() : this.updateExercise();
      },
    },
  ];

  get sets() {
    return this.exerciseForm.get('sets');
  }

  get setDuration() {
    return this.exerciseForm.get('setDuration');
  }

  ngOnInit(): void {
    this.sets?.setValue(this.exercise.sets);
    this.setDuration?.setValue(this.exercise.setDuration);

    this.calculateCalories();

    this.initFormEvent();
  }
  
  private initFormEvent(): void {
    this.sets?.valueChanges.subscribe(() => {
      if (this.setDuration?.value! !== '') {
        this.calculateCalories();
      }
    });

    this.setDuration?.valueChanges.subscribe(() => {
      this.calculateCalories();
    });
  }

  private calculateCalories(): void {
    let duration: number;
  
    if (this.sets?.value && this.sets?.value > 0) {
      duration = this.setDuration?.value! * this.sets?.value;
    } else {
      duration = this.setDuration?.value!;
    }

    this.caloriesBurned = Math.floor(
      this.exercise.exercise.mets * /*this.weight*/ 86 * (duration / 60)
    );
  }

  addExercise(): void {
    if (this.exerciseForm.invalid) {
      return;
    }

    const exercise = {
      day: this.day,
      exercise: this.exercise.exercise._id,
      caloriesBurned: this.caloriesBurned,
      ...this.exerciseForm.value,
    };

    this.diaryService.addDiaryExercise(exercise).subscribe({
      next: (response: ResponseObj<DiaryExercise>) => { this.sidePanelService.closeTopComponent(response.success) },
      error: (error) => { console.log(error) }
    })
  }

  updateExercise(): void {
    if (this.exerciseForm.invalid) {
      return;
    }

    const exercise = {
      day: this.day,
      exercise: this.exercise.exercise._id,
      caloriesBurned: this.caloriesBurned,
      diary: this.exercise.diary,
      ...this.exerciseForm.value,
    };

    this.diaryService.updateDiaryExercise(this.exercise._id, exercise).subscribe({
      next: (response: ResponseObj<DiaryExercise>) => { this.sidePanelService.closeTopComponent(response.success) },
      error: (error) => { console.log(error) }
    })
  }

  private submitForm(exerciseGroup: DiaryExercise[]): void {
    console.log(exerciseGroup);
  }

  goBack(): void {
    this.sidePanelService.closeTopComponent();
  }
}
