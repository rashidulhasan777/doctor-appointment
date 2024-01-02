import { Component, Inject, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { EventService } from '../../service/event.service';
import { v4 as uuidv4 } from 'uuid';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-create-appointment',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './create-appointment.component.html',
  styles: ``
})
export class CreateAppointmentComponent {
  appointmentForm!: FormGroup;
  eventService = inject(EventService);
  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<CreateAppointmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
    }

  ngOnInit(): void {
    this.appointmentForm = this.formBuilder.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      age: ['', Validators.required],
      date: [this.data?this.data?.date:'', [Validators.required, Validators.pattern('^\\d{4}-\\d{2}-\\d{2}$')]],
      time: ['', [Validators.required, Validators.pattern('^\\d{2}:\\d{2}$')]]
    });
  }
  onSubmit() {
    console.log(this.appointmentForm.value);
    if (this.appointmentForm.valid) {
      let time = this.appointmentForm.value.time;
      let hour = time.split(':')[0];
      let minute = time.split(':')[1];
      // add 30 minutes to the time
      minute = (parseInt(minute) + 30).toString();
      if (parseInt(minute) > 59) {
        hour = (parseInt(hour) + 1).toString();
        minute = (parseInt(minute) - 60).toString();
      }
      const endTime = `${hour}:${minute}`;
      const payload = {
        id: uuidv4(),
        title: `Name: ${this.appointmentForm.value.name}, Gender: ${this.appointmentForm.value.gender}, Age: ${this.appointmentForm.value.age}`,
        start: `${this.appointmentForm.value.date}T${this.appointmentForm.value.time}:00`,
        end: `${this.appointmentForm.value.date}T${endTime}:00`,

      }
      this.eventService.postEvent({...this.appointmentForm.value, payload}).subscribe((res) => {
        console.log(res);
        this.dialogRef.close();
      });
    }
  }
}
