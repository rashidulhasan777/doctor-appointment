import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-change-month',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatSelectModule,
],
  templateUrl: './change-month.component.html',
  styles: ``
})
export class ChangeMonthComponent implements OnInit {
  months: number[] = [];
  selectedMonth!: number;
  constructor(
    public dialogRef: MatDialogRef<ChangeMonthComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

  }
  ngOnInit(): void {
    for (let month = 1; month <= 12; month++) {
      this.months.push(month);

    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  setMonth(month: number): void {
    this.selectedMonth = month;
    console.log('selectedMonth: ', this.selectedMonth);

  }
}
