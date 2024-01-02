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
  selector: 'app-change-year',
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
  templateUrl: './change-year.component.html',
  styles: ``
})
export class ChangeYearComponent implements OnInit {
  years: number[] = [];
  selectedYear!: number;
  constructor(
    public dialogRef: MatDialogRef<ChangeYearComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

  }
  ngOnInit(): void {
    for (let year = 2024; year > 1920; year--) {
      this.years.push(year);

    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  setYear(year: number): void {
    this.selectedYear = year;
    console.log('selectedYear: ', this.selectedYear);

  }
}
